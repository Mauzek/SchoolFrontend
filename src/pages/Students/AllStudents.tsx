import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Popconfirm,
  Avatar,
  Tag,
  Typography,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./AllStudents.module.scss";
import {
  getAllStudents,
  deleteStudentById,
  registrationUser,
  getAllClasses,
} from "../../api/api-utils";

const { Title, Text } = Typography;
const { Option } = Select;

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

interface ClassData {
  idClass: number;
  classNumber: number;
  classLetter: string;
}

export const AllStudents: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredStudents, setFilteredStudents] = useState<StudentData[]>([]);
  const token = localStorage.getItem("accessToken") || "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Load students and classes data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [studentsResponse, classesResponse] = await Promise.all([
          getAllStudents(token),
          getAllClasses(token),
        ]);

        setStudents(studentsResponse);
        setFilteredStudents(studentsResponse);
        setClasses(classesResponse.classes);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter students based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredStudents(students);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = students.filter(
      (item) =>
        item.student.firstName.toLowerCase().includes(searchLower) ||
        item.student.lastName.toLowerCase().includes(searchLower) ||
        (item.student.middleName &&
          item.student.middleName.toLowerCase().includes(searchLower)) ||
        item.student.email.toLowerCase().includes(searchLower) ||
        `${item.class.classNumber}${item.class.classLetter}`
          .toLowerCase()
          .includes(searchLower)
    );

    setFilteredStudents(filtered);
  }, [searchText, students]);

  // Navigate to student profile
  const handleViewProfile = (studentId: number) => {
    navigate(`/profile/${studentId}`, { state: { role: 3 } });
  };

  // Delete student
  const handleDeleteStudent = async (studentId: number) => {
    try {
      setLoading(true);
      await deleteStudentById(studentId, token);
      message.success("Ученик успешно удален");

      // Refresh students list
      const updatedStudents = await getAllStudents(token);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (error) {
      console.error("Error deleting student:", error);
      message.error("Не удалось удалить ученика");
    } finally {
      setLoading(false);
    }
  };

  // Show add student modal
  const showAddModal = () => {
    form.resetFields();
    setPhotoFile(null);
    // Set a generated password in the form
    form.setFieldsValue({
      password: generatePassword(),
    });
    setIsModalVisible(true);
  };

  // Handle form submission
// In the handleSubmit function, generate the password there instead of showing it in the form
const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // Generate password here instead of showing it in the form
      const generatedPassword = generatePassword();
      
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('password', generatedPassword); // Use the generated password
      formData.append('firstName', values.firstName);
      formData.append('lastName', values.lastName);
      
      if (values.middleName) {
        formData.append('middleName', values.middleName);
      }
      
      formData.append('gender', values.gender);
      formData.append('login', values.login);
      formData.append('idRole', '3'); // Student role
      formData.append('idClass', values.idClass);
      formData.append('phone', values.phone);
      formData.append('birthDate', values.birthDate.format('YYYY-MM-DD'));
      formData.append('documentNumber', values.documentNumber);
      formData.append('bloodGroup', values.bloodGroup);
      
      if (photoFile) {
        formData.append('photo', photoFile);
      }
      
      setLoading(true);
      await registrationUser(formData, 'student', token);
      
      message.success('Ученик успешно добавлен');
      message.info(`Пароль для входа: ${generatedPassword}`);
      setIsModalVisible(false);
      
      // Refresh students list
      const updatedStudents = await getAllStudents(token);
      setStudents(updatedStudents);
      setFilteredStudents(updatedStudents);
    } catch (error) {
      console.error('Error adding student:', error);
      message.error('Не удалось добавить ученика');
    } finally {
      setLoading(false);
    }
  };
  

  // Handle photo upload
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format("DD.MM.YYYY");
  };

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Table columns
  const columns = [
    {
      title: "Фото",
      dataIndex: ["student", "photo"],
      key: "photo",
      width: 80,
      render: (photo: string | null, record: StudentData) => (
        <Avatar size={40} src={photo} className={styles.students__avatar}>
          {!photo &&
            getInitials(record.student.firstName, record.student.lastName)}
        </Avatar>
      ),
    },
    {
      title: "ФИО",
      key: "name",
      render: (record: StudentData) => (
        <div className={styles.students__name}>
          <Text strong>
            {record.student.lastName} {record.student.firstName}
          </Text>
          {record.student.middleName && (
            <Text> {record.student.middleName}</Text>
          )}
        </div>
      ),
      sorter: (a: StudentData, b: StudentData) =>
        `${a.student.lastName} ${a.student.firstName}`.localeCompare(
          `${b.student.lastName} ${b.student.firstName}`
        ),
    },
    {
      title: "Класс",
      key: "class",
      render: (record: StudentData) => (
        <Tag color="blue" className={styles.students__classTag}>
          {record.class.classNumber}
          {record.class.classLetter}
        </Tag>
      ),
      sorter: (a: StudentData, b: StudentData) => {
        if (a.class.classNumber !== b.class.classNumber) {
          return a.class.classNumber - b.class.classNumber;
        }
        return a.class.classLetter.localeCompare(b.class.classLetter);
      },
    },
    {
      title: "Пол",
      dataIndex: ["student", "gender"],
      key: "gender",
      render: (gender: string) => (
        <Tag
          color={gender === "male" ? "blue" : "magenta"}
          icon={gender === "male" ? <ManOutlined /> : <WomanOutlined />}
          className={styles.students__genderTag}
        >
          {gender === "male" ? "Мужской" : "Женский"}
        </Tag>
      ),
    },
    {
      title: "Дата рождения",
      dataIndex: ["student", "birthDate"],
      key: "birthDate",
      render: (date: string) => formatDate(date),
      sorter: (a: StudentData, b: StudentData) =>
        new Date(a.student.birthDate).getTime() -
        new Date(b.student.birthDate).getTime(),
    },
    {
      title: "Email",
      dataIndex: ["student", "email"],
      key: "email",
    },
    {
      title: "Телефон",
      dataIndex: ["student", "phone"],
      key: "phone",
    },
    {
      title: "Родители",
      key: "parents",
      render: (record: StudentData) => (
        <div>
          {record.parents.length > 0 ? (
            record.parents.map((parent) => (
              <div key={parent.idParent} className={styles.students__parent}>
                {parent.lastName} {parent.firstName} {parent.middleName}
              </div>
            ))
          ) : (
            <Text type="secondary">Нет данных</Text>
          )}
        </div>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 180,
      render: (record: StudentData) => (
        <Space size="small" className={styles.students__actions}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record.student.idStudent)}
            className={styles.students__actionButton}
          >
            Профиль
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этого ученика?"
            onConfirm={() => handleDeleteStudent(record.student.idStudent)}
            okText="Да"
            cancelText="Нет"
            placement="left"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className={styles.students__actionButton}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.students}>
      <div className={styles.students__header}>
        <Title level={2} className={styles.students__title}>
          Все ученики
        </Title>
        <div className={styles.students__controls}>
          <Input
            placeholder="Поиск по имени, классу, email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.students__search}
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showAddModal}
            className={styles.students__addButton}
          >
            Добавить ученика
          </Button>
        </div>
      </div>

      <div className={styles.students__tableContainer}>
        <Table
          dataSource={filteredStudents}
          columns={columns}
          rowKey={(record) => record.student.idStudent.toString()}
          loading={loading}

          className={styles.students__table}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Add Student Modal */}
      <Modal
        title="Добавить нового ученика"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Добавить"
        cancelText="Отмена"
        className={styles.students__modal}
        width={700}
      >
        <Form form={form} layout="vertical" className={styles.students__form}>
          <div className={styles.students__formRow}>
            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[{ required: true, message: "Введите фамилию" }]}
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="Имя"
              rules={[{ required: true, message: "Введите имя" }]}
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="middleName"
              label="Отчество"
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <div className={styles.students__formRow}>
            <Form.Item
              name="gender"
              label="Пол"
              rules={[{ required: true, message: "Выберите пол" }]}
              className={styles.students__formItem}
            >
              <Select>
                <Option value="male">Мужской</Option>
                <Option value="female">Женский</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="birthDate"
              label="Дата рождения"
              rules={[{ required: true, message: "Выберите дату рождения" }]}
              className={styles.students__formItem}
            >
              <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="idClass"
              label="Класс"
              rules={[{ required: true, message: "Выберите класс" }]}
              className={styles.students__formItem}
            >
              <Select>
                {classes.map((classItem) => (
                  <Option
                    key={classItem.idClass}
                    value={classItem.idClass.toString()}
                  >
                    {classItem.classNumber}
                    {classItem.classLetter}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className={styles.students__formRow}>
            <Form.Item
              name="phone"
              label="Телефон"
              rules={[{ required: true, message: "Введите телефон" }]}
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Введите email" },
                { type: "email", message: "Введите корректный email" },
              ]}
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="login"
              label="Логин"
              rules={[{ required: true, message: "Введите логин" }]}
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <div className={styles.students__formRow}>
            <Form.Item
              name="documentNumber"
              label="Номер документа"
              rules={[{ required: true, message: "Введите номер документа" }]}
              className={styles.students__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="bloodGroup"
              label="Группа крови"
              className={styles.students__formItem}
            >
              <Select>
                <Option value="O+">O+</Option>
                <Option value="O-">O-</Option>
                <Option value="A+">A+</Option>
                <Option value="A-">A-</Option>
                <Option value="B+">B+</Option>
                <Option value="B-">B-</Option>
                <Option value="AB+">AB+</Option>
                <Option value="AB-">AB-</Option>
                <Option value="NaN">Не указано</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="Фотография" className={styles.students__formItem}>
            <div className={styles.students__uploadContainer}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Button
                icon={<UploadOutlined />}
                onClick={() => fileInputRef.current?.click()}
                className={styles.students__uploadButton}
              >
                Выбрать фото
              </Button>
              {photoFile && (
                <Text className={styles.students__fileName}>
                  {photoFile.name}
                </Text>
              )}
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
