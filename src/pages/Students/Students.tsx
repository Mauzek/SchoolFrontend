import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Avatar,
  List,
  Tag,
  Divider,
  Spin,
  Empty,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  TeamOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  CalendarOutlined,
  ManOutlined,
  WomanOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import styles from "./Students.module.scss";
import {
  getClassesByEmployeeId,
  getStudentsByClassId,
} from "../../api/api-utils";
import { RootState } from "../../store";

const { Title, Text } = Typography;

interface ClassData {
  idClass: number;
  classNumber: number;
  classLetter: string;
  studyYear: number;
  classTeacher: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
  };
  studentCount: string;
}

interface StudentData {
  student: {
    idStudent: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
    phone: string;
    birthDate: string;
    login: string;
    email: string;
    gender: "male" | "female";
    photo: string | null;
    documentNumber: string;
    bloodGroup: string;
  };
  class: {
    idClass: number;
    classNumber: number;
    classLetter: string;
  };
  parents: {
    idParent: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
  }[];
}

export const Students: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [view, setView] = useState<"classes" | "students">("classes");

  const token = localStorage.getItem("accessToken") || "";

  // Load teacher's classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoading(true);
        const response = await getClassesByEmployeeId(user.id, token);
        if (response && response.classes) {
          setClasses(response.classes);
        }
      } catch (error) {
        console.error("Error fetching classes:", error);
        message.error("Не удалось загрузить классы");
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [user.id, token]);

  // Handle class selection
  const handleClassSelect = async (classData: ClassData) => {
    try {
      setLoading(true);
      setSelectedClass(classData);

      const response = await getStudentsByClassId(classData.idClass, token);
      setStudents(response);
      setView("students");
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Не удалось загрузить информацию о студентах");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to student profile
  const navigateToStudentProfile = (studentId: number) => {
    navigate(`/profile/${studentId}`, { state: { role: 3 } });
  };

  // Navigate to parent profile
  const navigateToParentProfile = (parentId: number) => {
    navigate(`/profile/${parentId}`, { state: { role: 4 } });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ru-RU");
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Render classes view
  const renderClasses = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text className={styles.loadingText}>Загрузка классов...</Text>
        </div>
      );
    }

    if (classes.length === 0) {
      return (
        <Empty
          description="У вас нет назначенных классов"
          className={styles.emptyState}
        />
      );
    }

    return (
      <div className={styles.classesContainer}>
        <Title level={2} className={styles.sectionTitle}>
          <TeamOutlined className={styles.titleIcon} /> Мои классы
        </Title>
        <Row gutter={[24, 24]}>
          {classes.map((classItem) => (
            <Col xs={24} sm={12} md={8} lg={6} key={classItem.idClass}>
              <Card
                className={styles.classCard}
                hoverable
                onClick={() => handleClassSelect(classItem)}
              >
                <div className={styles.classHeader}>
                  <Title level={3} className={styles.classTitle}>
                    {classItem.classNumber}
                    {classItem.classLetter}
                  </Title>
                  <Tag color="blue" className={styles.classYear}>
                    {classItem.studyYear} год
                  </Tag>
                </div>
                <div className={styles.classInfo}>
                  <Text className={styles.studentCount}>
                    Учеников: {classItem.studentCount}
                  </Text>
                  {classItem.classTeacher &&
                    classItem.classTeacher.id === user.id && (
                      <Tag color="green" className={styles.classTeacherTag}>
                        Классный руководитель
                      </Tag>
                    )}
                </div>
                <div className={styles.viewDetailsLink}>
                  Просмотреть учеников →
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  // Render students view
  const renderStudents = () => {
    if (!selectedClass) return null;

    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <Spin size="large" />
          <Text className={styles.loadingText}>
            Загрузка информации о студентах...
          </Text>
        </div>
      );
    }

    if (students.length === 0) {
      return (
        <Empty
          description={`В классе ${selectedClass.classNumber}${selectedClass.classLetter} нет учеников`}
          className={styles.emptyState}
        />
      );
    }

    return (
      <div className={styles.studentsContainer}>
        <div className={styles.studentsHeader}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => setView("classes")}
            className={styles.backButton}
          >
            Назад к списку классов
          </Button>
          <Title level={2} className={styles.sectionTitle}>
            Класс {selectedClass.classNumber}
            {selectedClass.classLetter}
          </Title>
        </div>

        <List
          className={styles.studentsList}
          itemLayout="vertical"
          dataSource={students}
          renderItem={(item) => (
            <List.Item
              key={item.student.idStudent}
              className={styles.studentItem}
            >
              <div className={styles.studentCard}>
                <div className={styles.studentHeader}>
                  <div className={styles.studentAvatar}>
                    {item.student.photo ? (
                      <Avatar
                        size={80}
                        src={item.student.photo}
                        className={styles.avatar}
                      />
                    ) : (
                      <Avatar size={80} className={styles.defaultAvatar}>
                        {getInitials(
                          item.student.firstName,
                          item.student.lastName
                        )}
                      </Avatar>
                    )}
                  </div>
                  <div className={styles.studentInfo}>
                    <Title level={4} className={styles.studentName}>
                      {item.student.lastName} {item.student.firstName}{" "}
                      {item.student.middleName}
                    </Title>
                    <div className={styles.studentMeta}>
                      <Tag
                        color={
                          item.student.gender === "male" ? "blue" : "magenta"
                        }
                        className={styles.genderTag}
                      >
                        {item.student.gender === "male" ? (
                          <ManOutlined />
                        ) : (
                          <WomanOutlined />
                        )}
                        {item.student.gender === "male"
                          ? " Мужской"
                          : " Женский"}
                      </Tag>
                      <Tag color="cyan" className={styles.classTag}>
                        Класс: {item.class.classNumber}
                        {item.class.classLetter}
                      </Tag>
                    </div>
                    <Button
                      type="primary"
                      onClick={() =>
                        navigateToStudentProfile(item.student.idStudent)
                      }
                      className={styles.profileButton}
                    >
                      Профиль ученика
                    </Button>
                  </div>
                </div>

                <Divider className={styles.divider} />

                <div className={styles.studentDetails}>
                  <Row gutter={[24, 16]}>
                    <Col xs={24} sm={12} md={8}>
                      <div className={styles.detailItem}>
                        <CalendarOutlined className={styles.detailIcon} />
                        <div>
                          <Text type="secondary">Дата рождения:</Text>
                          <div>{formatDate(item.student.birthDate)}</div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className={styles.detailItem}>
                        <PhoneOutlined className={styles.detailIcon} />
                        <div>
                          <Text type="secondary">Телефон:</Text>
                          <div>{item.student.phone}</div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className={styles.detailItem}>
                        <MailOutlined className={styles.detailIcon} />
                        <div>
                          <Text type="secondary">Email:</Text>
                          <div>{item.student.email}</div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className={styles.detailItem}>
                        <IdcardOutlined className={styles.detailIcon} />
                        <div>
                          <Text type="secondary">Документ:</Text>
                          <div>{item.student.documentNumber}</div>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12} md={8}>
                      <div className={styles.detailItem}>
                        <HomeOutlined className={styles.detailIcon} />
                        <div>
                          <Text type="secondary">Группа крови:</Text>
                          <div>{item.student.bloodGroup}</div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                {item.parents.length > 0 && (
                  <>
                    <Divider
                      orientation="left"
                      className={styles.parentsDivider}
                    >
                      Родители
                    </Divider>
                    <div className={styles.parentsContainer}>
                      {item.parents.map((parent) => (
                        <div
                          key={parent.idParent}
                          className={styles.parentItem}
                        >
                          <Avatar
                            icon={<UserOutlined />}
                            className={styles.parentAvatar}
                          />
                          <div className={styles.parentInfo}>
                            <Text strong className={styles.parentName}>
                              {parent.lastName} {parent.firstName}{" "}
                              {parent.middleName}
                            </Text>
                            <Button
                              size="small"
                              onClick={() =>
                                navigateToParentProfile(parent.idParent)
                              }
                              className={styles.parentProfileButton}
                            >
                              Профиль родителя
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  };

  return (
    <div className={styles.studentsPage}>
      {view === "classes" ? renderClasses() : renderStudents()}
    </div>
  );
};
