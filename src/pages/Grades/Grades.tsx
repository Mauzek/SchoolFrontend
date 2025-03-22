import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import styles from "./Grades.module.scss";
import {
  getAllSubjects,
  getAllClasses,
  getGradesByClassBySubject,
  getStudentsByParentId,
  createGrade,
  updateGrade,
  deleteGrade,
} from "../../api/api-utils";
import {
  ApiGradesResponse,
  ApiChildrensResponse,
  ApiCreateGrade,
  ApiUpdateGrade,
} from "../../types";
import {
  Button,
  Card,
  Select,
  Table,
  Tag,
  Input,
  DatePicker,
  Popconfirm,
  message,
  Modal,
  Form,
  Tooltip,
} from "antd";
import {
  ArrowLeftOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LeftOutlined,
  RightOutlined,
  BookOutlined,
  CalculatorOutlined,
  HistoryOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  GlobalOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

export const Grades = () => {
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [grades, setGrades] = useState<ApiGradesResponse[] | null>(null);
  const [children, setChildren] = useState<ApiChildrensResponse[]>([]);
  const [selectedChild, setSelectedChild] =
    useState<ApiChildrensResponse | null>(null);
  const [view, setView] = useState<
    "subjects" | "classes" | "grades" | "children"
  >("subjects");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGrade, setEditingGrade] = useState<any | null>(null);
  const [form] = Form.useForm();
  const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());

  const token = localStorage.getItem("accessToken") || "";
  const userRoleId = user.user.role?.id;
  const userId = user.user.id;
  const idParent = user.user.additionalInfo?.idParent;

  // Add these helper functions inside your Grades component
  // Function to get a random color from a predefined set
  const getSubjectColor = (id: number) => {
    const colors = [
      "var(--color-primary)",
      "var(--color-secondary)",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#3f51b5",
      "#e91e63",
      "#009688",
    ];

    return colors[id % colors.length];
  };

  // Function to get an icon for a subject
  const getSubjectIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("math") || lowerName.includes("матем")) {
      return <CalculatorOutlined />;
    } else if (lowerName.includes("history") || lowerName.includes("истор")) {
      return <HistoryOutlined />;
    } else if (lowerName.includes("physics") || lowerName.includes("физик")) {
      return <RocketOutlined />;
    } else if (lowerName.includes("chemistry") || lowerName.includes("хими")) {
      return <ExperimentOutlined />;
    } else if (lowerName.includes("biology") || lowerName.includes("биолог")) {
      return <MedicineBoxOutlined />;
    } else if (
      lowerName.includes("literature") ||
      lowerName.includes("литерат")
    ) {
      return <ReadOutlined />;
    } else if (
      lowerName.includes("geography") ||
      lowerName.includes("географ")
    ) {
      return <GlobalOutlined />;
    }

    return <BookOutlined />;
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // Initial data loading based on user role
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        if (userRoleId === 3) {
          // Student
          const subjectsResponse = await getAllSubjects(token);
          setSubjects(subjectsResponse.subjects);
          setView("subjects");
        } else if (userRoleId === 4 && idParent) {
          // Parent
          const childrenResponse = await getStudentsByParentId(idParent, token);
          setChildren(childrenResponse);
          setView("children");
        } else if (userRoleId === 2 || userRoleId === 1) {
          // Teacher or Admin
          const subjectsResponse = await getAllSubjects(token);
          setSubjects(subjectsResponse.subjects);
          setView("subjects");
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
        message.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [userRoleId, userId, token, idParent]);

  // Load classes when a subject is selected (for teachers)
  useEffect(() => {
    const loadClasses = async () => {
      if (selectedSubject && (userRoleId === 2 || userRoleId === 1)) {
        setLoading(true);
        try {
          // Use getAllClasses to allow teachers to set grades for any class
          const classesResponse = await getAllClasses(token);
          setClasses(classesResponse.classes);
          setView("classes");
        } catch (error) {
          console.error("Error loading classes:", error);
          message.error("Не удалось загрузить классы");
        } finally {
          setLoading(false);
        }
      }
    };

    loadClasses();
  }, [selectedSubject, userRoleId, token]);

  // Load grades when class and subject are selected
  useEffect(() => {
    const loadGrades = async () => {
      if (selectedSubject && selectedClass) {
        setLoading(true);
        try {
          const gradesResponse = await getGradesByClassBySubject(
            selectedClass,
            selectedSubject,
            token
          );

          // Check if the response is an array and handle accordingly
          if (Array.isArray(gradesResponse)) {
            setGrades(gradesResponse);
          } else {
            // If it's a single object, wrap it in an array
            setGrades([gradesResponse]);
          }

          setView("grades");
        } catch (error) {
          console.error("Error loading grades:", error);
          message.error("Не удалось загрузить оценки");
        } finally {
          setLoading(false);
        }
      }
    };

    loadGrades();
  }, [selectedSubject, selectedClass, token]);

  // Load grades for student
  const loadStudentGrades = async (subjectId: number, classId: number) => {
    setLoading(true);
    try {
      const gradesResponse = await getGradesByClassBySubject(
        classId,
        subjectId,
        token
      );

      // Check if the response is an array and handle accordingly
      if (Array.isArray(gradesResponse)) {
        setGrades(gradesResponse);
      } else {
        // If it's a single object, wrap it in an array
        setGrades([gradesResponse]);
      }

      setView("grades");
    } catch (error) {
      console.error("Error loading student grades:", error);
      message.error("Не удалось загрузить оценки");
    } finally {
      setLoading(false);
    }
  };

  // Handle subject selection
  const handleSubjectSelect = (subjectId: number) => {
    setSelectedSubject(subjectId);

    if (userRoleId === 3) {
      // Student
      // For students, directly load grades
      const classId = user.user.additionalInfo?.idClass || 0;
      loadStudentGrades(subjectId, classId);
    } else if (userRoleId === 4 && selectedChild) {
      // Parent
      // For parents, load grades for the selected child
      const classId = selectedChild.class.idClass;
      loadStudentGrades(subjectId, classId);
    }
    // For teachers, the useEffect will load classes
  };

  // Handle class selection
  const handleClassSelect = (classId: number) => {
    setSelectedClass(classId);
    // The useEffect will load grades
  };

  // Handle child selection for parents
  const handleChildSelect = (child: ApiChildrensResponse) => {
    setSelectedChild(child);
    setView("subjects");
    getAllSubjects(token)
      .then((response) => {
        setSubjects(response.subjects);
      })
      .catch((error) => {
        console.error("Error loading subjects:", error);
        message.error("Не удалось загрузить предметы");
      });
  };

  // Handle back button
  const handleBack = () => {
    if (view === "grades") {
      if (userRoleId === 3) {
        // Student
        setView("subjects");
        setSelectedSubject(null);
      } else if (userRoleId === 2 || userRoleId === 1) {
        // Teacher or Admin
        setView("classes");
        setSelectedClass(null);
      } else if (userRoleId === 4) {
        // Parent
        setView("subjects");
        setSelectedSubject(null);
      }
    } else if (view === "classes") {
      setView("subjects");
      setSelectedSubject(null);
    } else if (view === "subjects" && userRoleId === 4) {
      // Parent
      setView("children");
      setSelectedChild(null);
    }
  };

  // Handle month navigation
  const handleMonthChange = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setCurrentMonth(currentMonth.subtract(1, "month"));
    } else {
      setCurrentMonth(currentMonth.add(1, "month"));
    }
  };

  // Handle adding a new grade (for teachers)
  const handleAddGrade = (studentId: number, date?: dayjs.Dayjs) => {
    form.resetFields();
    form.setFieldsValue({
      idStudent: studentId,
      gradeDate: date || dayjs(),
    });
    setEditingGrade(null);
    setIsModalVisible(true);
  };

  // Handle editing a grade (for teachers)
  const handleEditGrade = (grade: any, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    setEditingGrade(grade);
    form.resetFields();
    form.setFieldsValue({
      gradeValue: grade.grade,
      gradeDate: dayjs(grade.gradeDate),
      gradeType: grade.gradeType,
      description: grade.description || "",
    });
    setIsModalVisible(true);
  };

  // Handle deleting a grade (for teachers)
  const handleDeleteGrade = async (gradeId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      await deleteGrade(gradeId, token);
      message.success("Оценка успешно удалена");
      // Refresh grades
      if (selectedSubject && selectedClass) {
        const gradesResponse = await getGradesByClassBySubject(
          selectedClass,
          selectedSubject,
          token
        );

        // Check if the response is an array and handle accordingly
        if (Array.isArray(gradesResponse)) {
          setGrades(gradesResponse);
        } else {
          // If it's a single object, wrap it in an array
          setGrades([gradesResponse]);
        }
      }
    } catch (error) {
      console.error("Error deleting grade:", error);
      message.error("Не удалось удалить оценку");
    }
  };

  // Handle form submission for adding/editing grades
  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingGrade) {
        // Update existing grade
        const updateData: ApiUpdateGrade = {
          gradeValue: values.gradeValue,
          gradeDate: values.gradeDate.format("YYYY-MM-DD"),
          gradeType: values.gradeType,
          description: values.description,
        };

        await updateGrade(editingGrade.idGrade, updateData, token);
        message.success("Оценка успешно обновлена");
      } else {
        // Create new grade
        const createData: ApiCreateGrade = {
          idStudent: values.idStudent,
          idSubject: selectedSubject!,
          gradeValue: values.gradeValue,
          gradeDate: values.gradeDate.format("YYYY-MM-DD"),
          gradeType: values.gradeType,
          description: values.description,
        };

        await createGrade(createData, token);
        message.success("Оценка успешно добавлена");
      }

      setIsModalVisible(false);

      // Refresh grades
      if (selectedSubject && selectedClass) {
        const gradesResponse = await getGradesByClassBySubject(
          selectedClass,
          selectedSubject,
          token
        );

        // Check if the response is an array and handle accordingly
        if (Array.isArray(gradesResponse)) {
          setGrades(gradesResponse);
        } else {
          // If it's a single object, wrap it in an array
          setGrades([gradesResponse]);
        }
      }
    } catch (error) {
      console.error("Form submission error:", error);
      message.error("Ошибка при сохранении оценки");
    }
  };

  // Render children list for parents
  const renderChildrenList = () => {
    return (
      <div className={styles.childrenList}>
        <h2>Выберите ребенка</h2>
        <div className={styles.cardContainer}>
          {children.map((child) => (
            <Card
              key={child.student.idStudent}
              className={styles.childCard}
              hoverable
              onClick={() => handleChildSelect(child)}
            >
              <div className={styles.childInfo}>
                <div className={styles.childPhoto}>
                  {child.student.photo ? (
                    <img
                      src={child.student.photo}
                      alt={`${child.student.firstName} ${child.student.lastName}`}
                      className={styles.childImage}
                    />
                  ) : (
                    <div className={styles.noPhoto}>
                      {child.student.firstName.charAt(0)}
                      {child.student.lastName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className={styles.childName}>
                  <h3 className={styles.childNameText}>
                    {child.student.lastName} {child.student.firstName}{" "}
                    {child.student.middleName}
                  </h3>
                  <p className={styles.childClass}>
                    Класс: {child.class.classNumber}
                    {child.class.classLetter}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render subjects list
  const renderSubjectsList = () => {
    return (
      <div className={styles.subjectsList}>
        <h2 className={styles.subjectsTitle}>Выберите предмет</h2>
        {userRoleId === 4 && selectedChild && (
          <div className={styles.selectedChild}>
            <button onClick={handleBack} className={styles.backButton}>
              <ArrowLeftOutlined /> Назад к списку детей
            </button>
            <h3 className={styles.childName}>
              Ученик: {selectedChild.student.lastName}{" "}
              {selectedChild.student.firstName}
            </h3>
          </div>
        )}
        <div className={styles.cardContainer}>
          {subjects.map((subject) => (
            // In your renderSubjectsList function, modify only the Card component:
            <Card
              key={subject.idSubject}
              className={styles.subjectCard}
              hoverable
              onClick={() => handleSubjectSelect(subject.idSubject)}
              style={{ borderTopColor: getSubjectColor(subject.idSubject) }}
            >
              <div
                className={styles.subjectCardIcon}
                style={{ color: getSubjectColor(subject.idSubject) }}
              >
                {getSubjectIcon(subject.name)}
              </div>
              <h3 className={styles.subjectCardTitle}>{subject.name}</h3>
              <p className={styles.subjectCardDescription}>
                {truncateDescription(subject.description)}
              </p>
              <div className={styles.subjectCardFooter}>
                <span className={styles.subjectCardMore}>
                  Перейти к оценкам
                </span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Render classes list for teachers
  // Render classes list for teachers
  const renderClassesList = () => {
    return (
      <div className={styles.classesList}>
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeftOutlined /> Назад к предметам
          </button>
          <h2 className={styles.classesTitle}>Выберите класс</h2>
        </div>
        <div className={styles.cardContainer}>
          {classes.map((classItem) => (
            <Card
              key={classItem.idClass}
              className={styles.classCard}
              hoverable
              onClick={() => handleClassSelect(classItem.idClass)}
            >
              <h3 className={styles.className}>
                Класс {classItem.classNumber}
                {classItem.classLetter}
              </h3>
              <p className={styles.studentsCount}>
                Количество учеников: {classItem.studentsCount}
              </p>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to get border color based on grade value
  const getBorderColorClass = (grade: number) => {
    switch (grade) {
      case 5:
      case 4:
        return styles.grade5;
      case 3:
        return styles.grade3;
      case 2:
      case 1:
        return styles.grade2;
      default:
        return "";
    }
  };

  // Render grades table with month view
  const renderGradesTable = () => {
    if (!grades || grades.length === 0)
      return <div className={styles.noData}>Нет данных об оценках</div>;

    // Get days in current month
    const daysInMonth = currentMonth.daysInMonth();
    const monthStart = currentMonth.startOf("month");

    // Generate columns for the table
    const columns = [
      {
        title: "Ученик",
        dataIndex: "student",
        key: "student",
        fixed: "left" as "left",
        width: 200,
        render: (student: any) => {
          const isCurrentUser =
            user.user.additionalInfo.idStudent === student.idStudent;
          const isSelectedChild =
            userRoleId === 4 &&
            selectedChild &&
            student.idStudent === selectedChild.student.idStudent;

          return (
            <span
              className={
                isCurrentUser || isSelectedChild
                  ? styles.highlightedStudent
                  : ""
              }
            >
              {student.lastName} {student.firstName} {student.middleName || ""}{" "}
              {(isCurrentUser || isSelectedChild) && (
                <Tag color="orange">Вы</Tag>
              )}
            </span>
          );
        },
      },
    ];

    // Add a column for each day of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = monthStart.date(i);
      columns.push({
        title: i.toString(),
        dataIndex: ["grades"],
        key: `day-${i}`,
        width: 60,
        align: "center" as "center",
        render: (grades: any[], record: any) => {
          // Find grades for this day
          const dayGrades = grades.filter((grade) => {
            const gradeDate = dayjs(grade.gradeDate);
            return (
              gradeDate.date() === i &&
              gradeDate.month() === currentMonth.month() &&
              gradeDate.year() === currentMonth.year()
            );
          });

          if (dayGrades.length === 0) {
            // If teacher or admin, show add button on hover
            if (userRoleId === 2 || userRoleId === 1) {
              return (
                <div className={styles.emptyGradeCell}>
                  <Button
                    type="text"
                    size="small"
                    icon={<PlusOutlined />}
                    className={styles.addGradeButton}
                    onClick={() =>
                      handleAddGrade(record.student.idStudent, currentDate)
                    }
                  />
                </div>
              );
            }
            return null;
          }

          return (
            <div className={styles.gradesCell}>
              {dayGrades.map((grade) => (
                <Tooltip
                  key={grade.idGrade}
                  title={
                    <div>
                      <div>Тип: {grade.gradeType}</div>
                      {grade.description && (
                        <div>Комментарий: {grade.description}</div>
                      )}
                    </div>
                  }
                >
                  <div
                    className={`${styles.gradeItem} ${getBorderColorClass(
                      grade.grade
                    )}`}
                  >
                    <span className={styles.gradeValue}>{grade.grade}</span>

                    {(userRoleId === 2 || userRoleId === 1) && (
                      <div className={styles.gradeActions}>
                        <Button
                          type="text"
                          size="small"
                          icon={<EditOutlined />}
                          onClick={(e) => handleEditGrade(grade, e)}
                          className={styles.actionButton}
                        />
                        <Popconfirm
                          title="Вы уверены, что хотите удалить эту оценку?"
                          onConfirm={(e) =>
                            handleDeleteGrade(
                              grade.idGrade,
                              e as React.MouseEvent
                            )
                          }
                          okText="Да"
                          cancelText="Нет"
                        >
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            className={styles.actionButton}
                          />
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                </Tooltip>
              ))}
            </div>
          );
        },
      });
    }

    // Add an action column for teachers to add grades
    if (userRoleId === 2 || userRoleId === 1) {
      columns.push({
        title: "Действия",
        key: "actions",
        fixed: "right" as "right",
        width: 120,
        render: (text: any, record: any) => (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              handleAddGrade(record.student.idStudent);
            }}
            className={styles.addButton}
          >
            Добавить
          </Button>
        ),
      });
    }

    return (
      <div className={styles.gradesTable}>
        <div className={styles.header}>
          <button onClick={handleBack} className={styles.backButton}>
            <ArrowLeftOutlined /> Назад
          </button>
          <h2 className={styles.gradesTitle}>
            Оценки по предмету:{" "}
            {subjects.find((s) => s.idSubject === selectedSubject)?.name}
            {(userRoleId === 2 || userRoleId === 1) &&
              ` - Класс ${
                classes.find((c) => c.idClass === selectedClass)?.classNumber
              }${
                classes.find((c) => c.idClass === selectedClass)?.classLetter
              }`}
          </h2>
        </div>

        <div className={styles.monthNavigation}>
          <Button
            icon={<LeftOutlined />}
            onClick={() => handleMonthChange("prev")}
            className={styles.navButton}
          />
          <span className={styles.currentMonth}>
            {currentMonth.format("MMMM YYYY")}
          </span>
          <Button
            icon={<RightOutlined />}
            onClick={() => handleMonthChange("next")}
            className={styles.navButton}
          />
        </div>

        <Table
          dataSource={grades}
          columns={columns}
          rowKey={(record) =>
            record.student?.idStudent?.toString() || Math.random().toString()
          }
          pagination={false}
          loading={loading}
          scroll={{ x: "max-content" }}
          className={styles.monthTable}
          bordered
        />
      </div>
    );
  };

  // Render grade form modal
  const renderGradeFormModal = () => {
    return (
      <Modal
        title={editingGrade ? "Редактировать оценку" : "Добавить оценку"}
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText={editingGrade ? "Сохранить" : "Добавить"}
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" className={styles.gradeForm}>
          {!editingGrade && (
            <Form.Item
              name="idStudent"
              label="Ученик"
              rules={[{ required: true, message: "Выберите ученика" }]}
              className={styles.formItem}
            >
              <Select placeholder="Выберите ученика">
                {grades &&
                  grades.map((studentGrade) => (
                    <Option
                      key={studentGrade.student.idStudent}
                      value={studentGrade.student.idStudent}
                    >
                      {studentGrade.student.lastName}{" "}
                      {studentGrade.student.firstName}{" "}
                      {studentGrade.student.middleName || ""}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="gradeValue"
            label="Оценка"
            rules={[{ required: true, message: "Введите оценку" }]}
            className={styles.formItem}
          >
            <Select placeholder="Выберите оценку">
              <Option value={5}>5 (Отлично)</Option>
              <Option value={4}>4 (Хорошо)</Option>
              <Option value={3}>3 (Удовлетворительно)</Option>
              <Option value={2}>2 (Неудовлетворительно)</Option>
              <Option value={1}>1 (Плохо)</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="gradeDate"
            label="Дата"
            rules={[{ required: true, message: "Выберите дату" }]}
            className={styles.formItem}
          >
            <DatePicker format="YYYY-MM-DD" style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="gradeType"
            label="Тип оценки"
            rules={[{ required: true, message: "Выберите тип оценки" }]}
            className={styles.formItem}
          >
            <Select placeholder="Выберите тип оценки">
              <Option value="Контрольная работа">Контрольная работа</Option>
              <Option value="Самостоятельная работа">
                Самостоятельная работа
              </Option>
              <Option value="Домашняя работа">Домашняя работа</Option>
              <Option value="Ответ на уроке">Ответ на уроке</Option>
              <Option value="Тест">Тест</Option>
              <Option value="Экзамен">Экзамен</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Комментарий"
            className={styles.formItem}
          >
            <Input.TextArea rows={4} placeholder="Комментарий к оценке" />
          </Form.Item>
        </Form>
      </Modal>
    );
  };

  // Main render method
  return (
    <div className={styles.gradesPage}>
      <h1 className={styles.pageTitle}>Дневник</h1>

      {loading && <div className={styles.loading}>Загрузка...</div>}

      {!loading && (
        <>
          {view === "children" && renderChildrenList()}
          {view === "subjects" && renderSubjectsList()}
          {view === "classes" && renderClassesList()}
          {view === "grades" && renderGradesTable()}
        </>
      )}

      {renderGradeFormModal()}
    </div>
  );
};
