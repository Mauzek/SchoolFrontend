import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Typography,
  Card,
  Tag,
  Tooltip,
  Badge,
  Avatar,
  Tabs,
  Drawer,
  Empty,
  Divider,
  Statistic,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  CalendarOutlined,
  IdcardOutlined,
  EyeOutlined,
  ManOutlined,
  WomanOutlined,
  PhoneOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./Classes.module.scss";
import {
  getClassesByEmployeeId,
  getAllClasses,
  getStudentsByClassId,
  createClass,
  deleteClassById,
  getAllEmployees,
} from "../../api/api-utils";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface ClassTeacher {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
}

interface ClassData {
  idClass: number;
  classNumber: number;
  classLetter: string;
  studyYear: number;
  classTeacher: ClassTeacher | null;
  studentCount: string;
}

interface EmployeeData {
  idEmployee: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  photo: string | null;
  position: {
    idPosition: number;
    name: string;
  };
  role: {
    id: number;
    name: string;
  };
  isStaff: boolean;
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

export const Classes: React.FC = () => {
  const navigate = useNavigate();
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [teacherClasses, setTeacherClasses] = useState<ClassData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<number | null>(
    null
  );
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [studentsLoading, setStudentsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isStudentsDrawerVisible, setIsStudentsDrawerVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredClasses, setFilteredClasses] = useState<ClassData[]>([]);
  const token = localStorage.getItem("accessToken") || "";
  const [activeTab, setActiveTab] = useState<string>("all");

  // Load classes and employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [classesResponse, employeesResponse] = await Promise.all([
          getAllClasses(token),
          getAllEmployees(token),
        ]);

        setClasses(classesResponse.classes);
        setFilteredClasses(classesResponse.classes);

        // Filter only teachers and active staff
        const teachersOnly = employeesResponse.filter(
          (emp) => emp.role.name === "Teacher" && emp.isStaff
        );
        setEmployees(teachersOnly);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter classes based on search text
  useEffect(() => {
    let filtered = classes;

    // First apply tab filter
    if (activeTab === "withTeacher") {
      filtered = classes.filter((cls) => cls.classTeacher !== null);
    } else if (activeTab === "withoutTeacher") {
      filtered = classes.filter((cls) => cls.classTeacher === null);
    } else if (activeTab === "withStudents") {
      filtered = classes.filter((cls) => parseInt(cls.studentCount) > 0);
    } else if (activeTab === "withoutStudents") {
      filtered = classes.filter((cls) => parseInt(cls.studentCount) === 0);
    }

    // Then apply search text filter
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (cls) =>
          `${cls.classNumber}${cls.classLetter}`
            .toLowerCase()
            .includes(searchLower) ||
          cls.studyYear.toString().includes(searchLower) ||
          (cls.classTeacher &&
            `${cls.classTeacher.lastName} ${cls.classTeacher.firstName}`
              .toLowerCase()
              .includes(searchLower))
      );
    }

    setFilteredClasses(filtered);
  }, [searchText, classes, activeTab]);

  // Load teacher's classes when a teacher is selected
  useEffect(() => {
    const fetchTeacherClasses = async () => {
      if (!selectedTeacherId) {
        setTeacherClasses([]);
        return;
      }

      try {
        setLoading(true);
        const response = await getClassesByEmployeeId(selectedTeacherId, token);
        setTeacherClasses(response.classes);
      } catch (error) {
        console.error("Error fetching teacher classes:", error);
        message.error("Не удалось загрузить классы учителя");
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherClasses();
  }, [selectedTeacherId, token]);

  // Load students when a class is selected
  const handleViewStudents = async (classId: number) => {
    try {
      setStudentsLoading(true);
      setSelectedClassId(classId);
      const studentsData = await getStudentsByClassId(classId, token);
      setStudents(studentsData);
      setIsStudentsDrawerVisible(true);
    } catch (error) {
      console.error("Error fetching students:", error);
      message.error("Не удалось загрузить список учеников");
    } finally {
      setStudentsLoading(false);
    }
  };

  // Show add class modal
  const showAddModal = () => {
    form.resetFields();
    form.setFieldsValue({
      studyYear: new Date().getFullYear(),
    });
    setIsModalVisible(true);
  };

  // Handle form submission for new class
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);
      await createClass(
        {
          classNumber: values.classNumber,
          classLetter: values.classLetter,
          studyYear: values.studyYear,
          idEmployee: values.idEmployee || null,
        },
        token
      );

      message.success("Класс успешно добавлен");
      setIsModalVisible(false);

      // Refresh classes list
      const classesResponse = await getAllClasses(token);
      setClasses(classesResponse.classes);
      setFilteredClasses(classesResponse.classes);
    } catch (error) {
      console.error("Error adding class:", error);
      message.error("Не удалось добавить класс");
    } finally {
      setLoading(false);
    }
  };

  // Delete class
  const handleDeleteClass = async (classId: number) => {
    try {
      setLoading(true);
      await deleteClassById(classId, token);
      message.success("Класс успешно удален");

      // Refresh classes list
      const classesResponse = await getAllClasses(token);
      setClasses(classesResponse.classes);
      setFilteredClasses(classesResponse.classes);
    } catch (error) {
      console.error("Error deleting class:", error);
      message.error("Не удалось удалить класс");
    } finally {
      setLoading(false);
    }
  };

  // Navigate to student profile
  const handleViewStudentProfile = (studentId: number) => {
    navigate(`/profile/${studentId}`, { state: { role: 3 } });
  };

  // Navigate to teacher profile
  const handleViewTeacherProfile = (teacherId: number) => {
    navigate(`/profile/${teacherId}`, { state: { role: 2 } });
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

  // Get class color based on class number
  const getClassColor = (classNumber: number) => {
    switch (classNumber) {
      case 1:
      case 2:
      case 3:
      case 4:
        return "green"; // Elementary school
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
        return "blue"; // Middle school
      case 10:
      case 11:
        return "purple"; // High school
      default:
        return "cyan";
    }
  };

  // Table columns for all classes
  const classesColumns = [
    {
      title: "Класс",
      key: "class",
      width: 100,
      render: (record: ClassData) => (
        <Tag
          color={getClassColor(record.classNumber)}
          className={styles.classes__classTag}
        >
          {record.classNumber}
          {record.classLetter}
        </Tag>
      ),
      sorter: (a: ClassData, b: ClassData) => {
        if (a.classNumber !== b.classNumber) {
          return a.classNumber - b.classNumber;
        }
        return a.classLetter.localeCompare(b.classLetter);
      },
    },
    {
      title: "Учебный год",
      dataIndex: "studyYear",
      key: "studyYear",
      width: 120,
      render: (year: number) => (
        <div className={styles.classes__yearContainer}>
          <CalendarOutlined className={styles.classes__icon} />
          <span>{year}</span>
        </div>
      ),
      sorter: (a: ClassData, b: ClassData) => a.studyYear - b.studyYear,
    },
    {
      title: "Классный руководитель",
      key: "teacher",
      render: (record: ClassData) => (
        <div className={styles.classes__teacherContainer}>
          {record.classTeacher ? (
            <>
              <Avatar
                size={32}
                icon={<UserOutlined />}
                className={styles.classes__avatar}
              >
                {getInitials(
                  record.classTeacher.firstName,
                  record.classTeacher.lastName
                )}
              </Avatar>
              <div className={styles.classes__teacherInfo}>
                <Text className={styles.classes__teacherName}>
                  {record.classTeacher.lastName} {record.classTeacher.firstName}
                </Text>
                {record.classTeacher.middleName && (
                  <Text
                    type="secondary"
                    className={styles.classes__teacherMiddleName}
                  >
                    {record.classTeacher.middleName}
                  </Text>
                )}
              </div>
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewTeacherProfile(record.classTeacher.id);
                }}
                className={styles.classes__viewButton}
              />
            </>
          ) : (
            <Text type="secondary" italic>
              Не назначен
            </Text>
          )}
        </div>
      ),
      sorter: (a: ClassData, b: ClassData) => {
        if (!a.classTeacher && !b.classTeacher) return 0;
        if (!a.classTeacher) return 1;
        if (!b.classTeacher) return -1;
        return a.classTeacher.lastName.localeCompare(b.classTeacher.lastName);
      },
    },
    {
      title: "Количество учеников",
      dataIndex: "studentCount",
      key: "studentCount",
      width: 120,
      render: (count: string) => (
        <Badge
          count={count}
          showZero
          style={{
            backgroundColor: parseInt(count) > 0 ? "#52c41a" : "#d9d9d9",
            fontSize: "14px",
            fontWeight: "bold",
            minWidth: "32px",
            height: "32px",
            lineHeight: "32px",
            borderRadius: "16px",
          }}
        />
      ),
      sorter: (a: ClassData, b: ClassData) =>
        parseInt(a.studentCount) - parseInt(b.studentCount),
    },
    {
      title: "Действия",
      key: "actions",
      width: 200,
      render: (record: ClassData) => (
        <Space size="small" className={styles.classes__actions}>
          <Button
            type="primary"
            icon={<TeamOutlined />}
            onClick={() => handleViewStudents(record.idClass)}
            className={styles.classes__actionButton}
            disabled={parseInt(record.studentCount) === 0}
          >
            Ученики
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этот класс?"
            onConfirm={() => handleDeleteClass(record.idClass)}
            okText="Да"
            cancelText="Нет"
            placement="left"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className={styles.classes__actionButton}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Get selected class name
  const getSelectedClassName = () => {
    const selectedClass = classes.find(
      (cls) => cls.idClass === selectedClassId
    );
    if (selectedClass) {
      return `${selectedClass.classNumber}${selectedClass.classLetter}`;
    }
    return "";
  };

  // Table columns for students in drawer
  const studentsColumns = [
    {
      title: "Фото",
      dataIndex: ["student", "photo"],
      key: "photo",
      width: 80,
      render: (photo: string | null, record: StudentData) => (
        <Avatar size={40} src={photo} className={styles.classes__studentAvatar}>
          {!photo &&
            getInitials(record.student.firstName, record.student.lastName)}
        </Avatar>
      ),
    },
    {
      title: "ФИО",
      key: "name",
      render: (record: StudentData) => (
        <div className={styles.classes__studentName}>
          <Text strong>
            {record.student.lastName} {record.student.firstName}
          </Text>
          {record.student.middleName && (
            <Text type="secondary"> {record.student.middleName}</Text>
          )}
        </div>
      ),
      sorter: (a: StudentData, b: StudentData) =>
        `${a.student.lastName} ${a.student.firstName}`.localeCompare(
          `${b.student.lastName} ${b.student.firstName}`
        ),
    },
    {
      title: "Пол",
      dataIndex: ["student", "gender"],
      key: "gender",
      width: 100,
      render: (gender: string) => (
        <Tag
          color={gender === "male" ? "blue" : "magenta"}
          icon={gender === "male" ? <ManOutlined /> : <WomanOutlined />}
          className={styles.classes__genderTag}
        >
          {gender === "male" ? "М" : "Ж"}
        </Tag>
      ),
    },
    {
      title: "Дата рождения",
      dataIndex: ["student", "birthDate"],
      key: "birthDate",
      width: 120,
      render: (date: string) => formatDate(date),
    },
    {
      title: "Контакты",
      key: "contacts",
      render: (record: StudentData) => (
        <div className={styles.classes__contacts}>
          <div className={styles.classes__contactItem}>
            <PhoneOutlined className={styles.classes__contactIcon} />
            <Text>{record.student.phone}</Text>
          </div>
          <div className={styles.classes__contactItem}>
            <MailOutlined className={styles.classes__contactIcon} />
            <Text>{record.student.email}</Text>
          </div>
        </div>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 100,
      render: (record: StudentData) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewStudentProfile(record.student.idStudent)}
          className={styles.classes__actionButton}
        >
          Профиль
        </Button>
      ),
    },
  ];

  // Statistics cards for classes
  const renderStatistics = () => {
    const totalClasses = classes.length;
    const classesWithTeacher = classes.filter(
      (cls) => cls.classTeacher !== null
    ).length;
    const classesWithoutTeacher = classes.filter(
      (cls) => cls.classTeacher === null
    ).length;
    const totalStudents = classes.reduce(
      (sum, cls) => sum + parseInt(cls.studentCount),
      0
    );

    return (
      <Row gutter={[16, 16]} className={styles.classes__statsRow}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={styles.classes__statsCard}>
            <Statistic
              title="Всего классов"
              value={totalClasses}
              prefix={<BookOutlined className={styles.classes__statIcon} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={styles.classes__statsCard}>
            <Statistic
              title="С классным руководителем"
              value={classesWithTeacher}
              prefix={<UserOutlined className={styles.classes__statIcon} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={styles.classes__statsCard}>
            <Statistic
              title="Без классного руководителя"
              value={classesWithoutTeacher}
              prefix={<IdcardOutlined className={styles.classes__statIcon} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card className={styles.classes__statsCard}>
            <Statistic
              title="Всего учеников"
              value={totalStudents}
              prefix={<TeamOutlined className={styles.classes__statIcon} />}
            />
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <div className={styles.classes}>
      <div className={styles.classes__header}>
        <Title level={2} className={styles.classes__title}>
          Управление классами
        </Title>
        <div className={styles.classes__controls}>
          <Input
            placeholder="Поиск по номеру класса, учителю..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.classes__search}
          />
          <Select
            placeholder="Выберите учителя"
            allowClear
            onChange={(value) => setSelectedTeacherId(value)}
            className={styles.classes__teacherSelect}
          >
            {employees.map((employee) => (
              <Option key={employee.idEmployee} value={employee.idEmployee}>
                {employee.lastName} {employee.firstName} {employee.middleName}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className={styles.classes__addButton}
          >
            Добавить класс
          </Button>
        </div>
      </div>

      {renderStatistics()}

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className={styles.classes__tabs}
      >
        <TabPane tab="Все классы" key="all">
          {filteredClasses.length === 0 ? (
            <Empty
              description="Классы не найдены"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={styles.classes__empty}
            />
          ) : (
            <div className={styles.classes__tableContainer}>
              <Table
                dataSource={filteredClasses}
                columns={classesColumns}
                rowKey={(record) => record.idClass.toString()}
                loading={loading}
                className={styles.classes__table}
                pagination={{
                  showTotal: (total) => `Всего ${total} классов`,
                }}
              />
            </div>
          )}
        </TabPane>
        <TabPane tab="С классным руководителем" key="withTeacher">
          {filteredClasses.length === 0 ? (
            <Empty
              description="Классы не найдены"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={styles.classes__empty}
            />
          ) : (
            <div className={styles.classes__tableContainer}>
              <Table
                dataSource={filteredClasses}
                columns={classesColumns}
                rowKey={(record) => record.idClass.toString()}
                loading={loading}
                className={styles.classes__table}
                pagination={{
                  showTotal: (total) => `Всего ${total} классов`,
                }}
              />
            </div>
          )}
        </TabPane>
        <TabPane tab="Без классного руководителя" key="withoutTeacher">
          {filteredClasses.length === 0 ? (
            <Empty
              description="Классы не найдены"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={styles.classes__empty}
            />
          ) : (
            <div className={styles.classes__tableContainer}>
              <Table
                dataSource={filteredClasses}
                columns={classesColumns}
                rowKey={(record) => record.idClass.toString()}
                loading={loading}
                className={styles.classes__table}
                pagination={{
                  showTotal: (total) => `Всего ${total} классов`,
                }}
              />
            </div>
          )}
        </TabPane>
        <TabPane tab="С учениками" key="withStudents">
          {filteredClasses.length === 0 ? (
            <Empty
              description="Классы не найдены"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={styles.classes__empty}
            />
          ) : (
            <div className={styles.classes__tableContainer}>
              <Table
                dataSource={filteredClasses}
                columns={classesColumns}
                rowKey={(record) => record.idClass.toString()}
                loading={loading}
                className={styles.classes__table}
                pagination={{
                  showTotal: (total) => `Всего ${total} классов`,
                }}
              />
            </div>
          )}
        </TabPane>
        <TabPane tab="Без учеников" key="withoutStudents">
          {filteredClasses.length === 0 ? (
            <Empty
              description="Классы не найдены"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={styles.classes__empty}
            />
          ) : (
            <div className={styles.classes__tableContainer}>
              <Table
                dataSource={filteredClasses}
                columns={classesColumns}
                rowKey={(record) => record.idClass.toString()}
                loading={loading}
                className={styles.classes__table}
                pagination={{
                  showTotal: (total) => `Всего ${total} классов`,
                }}
              />
            </div>
          )}
        </TabPane>
        {selectedTeacherId && (
          <TabPane tab="Классы выбранного учителя" key="teacherClasses">
            {teacherClasses.length === 0 ? (
              <Empty
                description="У выбранного учителя нет классов"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                className={styles.classes__empty}
              />
            ) : (
              <div className={styles.classes__tableContainer}>
                <Table
                  dataSource={teacherClasses}
                  columns={classesColumns}
                  rowKey={(record) => record.idClass.toString()}
                  loading={loading}
                  className={styles.classes__table}
                  pagination={{
                    showTotal: (total) => `Всего ${total} классов`,
                  }}
                />
              </div>
            )}
          </TabPane>
        )}
      </Tabs>

      {/* Class Cards View (Alternative to Table) */}
      <div className={styles.classes__cardsContainer}>
        {filteredClasses.map((classItem) => (
          <Card
            key={classItem.idClass}
            className={styles.classes__classCard}
            actions={[
              <Tooltip title="Просмотреть учеников">
                <Button
                  type="text"
                  icon={<TeamOutlined />}
                  onClick={() => handleViewStudents(classItem.idClass)}
                  disabled={parseInt(classItem.studentCount) === 0}
                />
              </Tooltip>,
              <Popconfirm
                title="Вы уверены, что хотите удалить этот класс?"
                onConfirm={() => handleDeleteClass(classItem.idClass)}
                okText="Да"
                cancelText="Нет"
              >
                <Button type="text" icon={<DeleteOutlined />} danger />
              </Popconfirm>,
            ]}
          >
            <div className={styles.classes__cardContent}>
              <div>
                <div className={styles.classes__cardHeader}>
                  <Tag
                    color={getClassColor(classItem.classNumber)}
                    className={styles.classes__cardClassTag}
                  >
                    {classItem.classNumber}
                    {classItem.classLetter}
                  </Tag>
                  <div className={styles.classes__cardYear}>
                    <CalendarOutlined className={styles.classes__cardIcon} />
                    <Text>{classItem.studyYear}</Text>
                  </div>
                </div>
                <Divider className={styles.classes__cardDivider} />
                <div className={styles.classes__cardTeacher}>
                  <Text strong>Классный руководитель:</Text>
                  {classItem.classTeacher ? (
                    <div className={styles.classes__cardTeacherInfo}>
                      <Avatar
                        size={32}
                        icon={<UserOutlined />}
                        className={styles.classes__avatar}
                      >
                        {getInitials(
                          classItem.classTeacher.firstName,
                          classItem.classTeacher.lastName
                        )}
                      </Avatar>
                      <div>
                        <Text>
                          {classItem.classTeacher.lastName}{" "}
                          {classItem.classTeacher.firstName}
                        </Text>
                        {classItem.classTeacher.middleName && (
                          <Text
                            type="secondary"
                            className={styles.classes__teacherMiddleName}
                          >
                            {classItem.classTeacher.middleName}
                          </Text>
                        )}
                      </div>
                    </div>
                  ) : (
                    <Text type="secondary" italic>
                      Не назначен
                    </Text>
                  )}
                </div>
              </div>
              <div className={styles.classes__cardStudents}>
                <TeamOutlined className={styles.classes__cardIcon} />
                <Text>{classItem.studentCount} учеников</Text>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Class Modal */}
      <Modal
        title="Добавить новый класс"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Добавить"
        cancelText="Отмена"
        className={styles.classes__modal}
      >
        <Form form={form} layout="vertical" className={styles.classes__form}>
          <div className={styles.classes__formRow}>
            <Form.Item
              name="classNumber"
              label="Номер класса"
              rules={[
                { required: true, message: "Введите номер класса" },
                {
                  type: "number",
                  min: 1,
                  max: 11,
                  message: "Номер класса должен быть от 1 до 11",
                },
              ]}
              className={styles.classes__formItem}
            >
              <InputNumber min={1} max={11} style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="classLetter"
              label="Буква класса"
              rules={[
                { required: true, message: "Введите букву класса" },
                { max: 1, message: "Введите только одну букву" },
                {
                  validator: (_, value) => {
                    if (value && !/^[A-ZА-Я]$/.test(value)) {
                      return Promise.reject(
                        new Error("Введите заглавную букву")
                      );
                    }
                    return Promise.resolve();
                  },
                },
              ]}
              className={styles.classes__formItem}
            >
              <Input placeholder="А, Б, В..." />
            </Form.Item>
          </div>

          <Form.Item
            name="studyYear"
            label="Учебный год"
            rules={[{ required: true, message: "Введите учебный год" }]}
            className={styles.classes__formItem}
          >
            <InputNumber
              min={new Date().getFullYear()}
              max={new Date().getFullYear() + 10}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            name="idEmployee"
            label="Классный руководитель"
            className={styles.classes__formItem}
          >
            <Select
              placeholder="Выберите классного руководителя"
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {employees.map((employee) => (
                <Option key={employee.idEmployee} value={employee.idEmployee}>
                  {employee.lastName} {employee.firstName} {employee.middleName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Students Drawer */}
      <Drawer
        title={`Ученики класса ${getSelectedClassName()}`}
        placement="right"
        width={900}
        onClose={() => setIsStudentsDrawerVisible(false)}
        visible={isStudentsDrawerVisible}
        className={styles.classes__drawer}
        extra={
          <Space>
            <Button onClick={() => setIsStudentsDrawerVisible(false)}>
              Закрыть
            </Button>
          </Space>
        }
      >
        {studentsLoading ? (
          <div className={styles.classes__drawerLoading}>
            <div className={styles.classes__drawerLoadingContent}>
              <div className={styles.classes__drawerLoadingIcon}>
                <TeamOutlined spin />
              </div>
              <Text>Загрузка списка учеников...</Text>
            </div>
          </div>
        ) : students.length === 0 ? (
          <Empty
            description="В этом классе нет учеников"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            className={styles.classes__drawerEmpty}
          />
        ) : (
          <>
            <div className={styles.classes__drawerStats}>
              <Card className={styles.classes__drawerStatsCard}>
                <Statistic
                  title="Всего учеников"
                  value={students.length}
                  prefix={<TeamOutlined className={styles.classes__statIcon} />}
                />
              </Card>
              <Card className={styles.classes__drawerStatsCard}>
                <Statistic
                  title="Мальчики"
                  value={
                    students.filter((s) => s.student.gender === "male").length
                  }
                  prefix={<ManOutlined className={styles.classes__statIcon} />}
                />
              </Card>
              <Card className={styles.classes__drawerStatsCard}>
                <Statistic
                  title="Девочки"
                  value={
                    students.filter((s) => s.student.gender === "female").length
                  }
                  prefix={
                    <WomanOutlined className={styles.classes__statIcon} />
                  }
                />
              </Card>
            </div>
            <Table
              dataSource={students}
              columns={studentsColumns}
              rowKey={(record) => record.student.idStudent.toString()}
              className={styles.classes__studentsTable}
              pagination={{
                showTotal: (total) => `Всего ${total} учеников`,
              }}
            />
          </>
        )}
      </Drawer>
    </div>
  );
};
