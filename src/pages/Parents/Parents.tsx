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
  message,
  Popconfirm,
  Avatar,
  Tag,
  Typography,
  Divider,
  Transfer,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import styles from "./Parents.module.scss";
import {
  getAllParents,
  deleteParentById,
  registrationUser,
  getAllStudents,
} from "../../api/api-utils";

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ParentData {
  idParent: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: "male" | "female";
  photo: string | null;
  role: {
    name: string;
  };
  parentType: string;
  phone: string;
  workPhone: string | null;
  workplace: string;
  position: string;
  childrenCount: number;
  passportSeries: string;
  passportNumber: string;
  registrationAddress: string;
}

interface StudentData {
  student: {
    idStudent: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
  };
  class: {
    classNumber: number;
    classLetter: string;
  };
}

export const Parents: React.FC = () => {
  const navigate = useNavigate();
  const [parents, setParents] = useState<ParentData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredParents, setFilteredParents] = useState<ParentData[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
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

  // Load parents and students data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [parentsResponse, studentsResponse] = await Promise.all([
          getAllParents(token),
          getAllStudents(token),
        ]);

        setParents(parentsResponse);
        setFilteredParents(parentsResponse);
        setStudents(studentsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter parents based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredParents(parents);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = parents.filter(
      (item) =>
        item.firstName.toLowerCase().includes(searchLower) ||
        item.lastName.toLowerCase().includes(searchLower) ||
        (item.middleName &&
          item.middleName.toLowerCase().includes(searchLower)) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.phone.toLowerCase().includes(searchLower) ||
        item.parentType.toLowerCase().includes(searchLower)
    );

    setFilteredParents(filtered);
  }, [searchText, parents]);

  // Navigate to parent profile
  const handleViewProfile = (parentId: number) => {
    navigate(`/profile/${parentId}`, { state: { role: 4 } });
  };

  // Delete parent
  const handleDeleteParent = async (parentId: number) => {
    try {
      setLoading(true);
      await deleteParentById(parentId, token);
      message.success("Родитель успешно удален");

      // Refresh parents list
      const updatedParents = await getAllParents(token);
      setParents(updatedParents);
      setFilteredParents(updatedParents);
    } catch (error) {
      console.error("Error deleting parent:", error);
      message.error("Не удалось удалить родителя");
    } finally {
      setLoading(false);
    }
  };

  // Show add parent modal
  const showAddModal = () => {
    form.resetFields();
    setPhotoFile(null);
    setSelectedStudents([]);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Generate password
      const generatedPassword = generatePassword();

      const formData = new FormData();
      formData.append("email", values.email);
      formData.append("password", generatedPassword);
      formData.append("firstName", values.firstName);
      formData.append("lastName", values.lastName);

      if (values.middleName) {
        formData.append("middleName", values.middleName);
      }

      formData.append("gender", values.gender);
      formData.append("login", values.login);
      formData.append("idRole", "4"); // Parent role
      formData.append("parentType", values.parentType);
      formData.append("phone", values.phone);

      if (values.workPhone) {
        formData.append("workPhone", values.workPhone);
      }

      formData.append("workplace", values.workplace);
      formData.append("position", values.position);
      formData.append("childrenCount", selectedStudents.length.toString());
      formData.append("passportSeries", values.passportSeries);
      formData.append("passportNumber", values.passportNumber);
      formData.append("registrationAddress", values.registrationAddress);
      formData.append("childrenIds", JSON.stringify(selectedStudents));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      console.log("Form Data:", selectedStudents);
      setLoading(true);
      await registrationUser(formData, "parent", token);

      message.success("Родитель успешно добавлен");
      message.info(`Пароль для входа: ${generatedPassword}`);
      setIsModalVisible(false);

      // Refresh parents list
      const updatedParents = await getAllParents(token);
      setParents(updatedParents);
      setFilteredParents(updatedParents);
    } catch (error) {
      console.error("Error adding parent:", error);
      message.error("Не удалось добавить родителя");
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

  // Get initials for avatar
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Handle student selection change
  const handleStudentChange = (targetKeys: string[]) => {
    setSelectedStudents(targetKeys);
  };

  // Table columns
  const columns = [
    {
      title: "Фото",
      dataIndex: "photo",
      key: "photo",
      width: 80,
      render: (photo: string | null, record: ParentData) => (
        <Avatar size={40} src={photo} className={styles.parents__avatar}>
          {!photo && getInitials(record.firstName, record.lastName)}
        </Avatar>
      ),
    },
    {
      title: "ФИО",
      key: "name",
      render: (record: ParentData) => (
        <div className={styles.parents__name}>
          <Text strong>
            {record.lastName} {record.firstName}
          </Text>
          {record.middleName && <Text> {record.middleName}</Text>}
        </div>
      ),
      sorter: (a: ParentData, b: ParentData) =>
        `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        ),
    },
    {
      title: "Тип",
      dataIndex: "parentType",
      key: "parentType",
      render: (type: string) => (
        <Tag color="blue" className={styles.parents__typeTag}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Пол",
      dataIndex: "gender",
      key: "gender",
      render: (gender: string) => (
        <Tag
          color={gender === "male" ? "blue" : "magenta"}
          icon={gender === "male" ? <ManOutlined /> : <WomanOutlined />}
          className={styles.parents__genderTag}
        >
          {gender === "male" ? "Мужской" : "Женский"}
        </Tag>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => (
        <div className={styles.parents__phone}>
          <PhoneOutlined /> {phone}
        </div>
      ),
    },
    {
      title: "Работа",
      key: "work",
      render: (record: ParentData) => (
        <div className={styles.parents__work}>
          <div>{record.workplace}</div>
          <div className={styles.parents__position}>{record.position}</div>
        </div>
      ),
    },
    {
      title: "Кол-во детей",
      dataIndex: "childrenCount",
      key: "childrenCount",
      render: (count: number) => (
        <Tag color="green" className={styles.parents__countTag}>
          {count}
        </Tag>
      ),
      sorter: (a: ParentData, b: ParentData) =>
        a.childrenCount - b.childrenCount,
    },
    {
      title: "Действия",
      key: "actions",
      width: 180,
      render: (record: ParentData) => (
        <Space size="small" className={styles.parents__actions}>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewProfile(record.idParent)}
            className={styles.parents__actionButton}
          >
            Профиль
          </Button>
          <Popconfirm
            title="Вы уверены, что хотите удалить этого родителя?"
            onConfirm={() => handleDeleteParent(record.idParent)}
            okText="Да"
            cancelText="Нет"
            placement="left"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className={styles.parents__actionButton}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.parents}>
      <div className={styles.parents__header}>
        <Title level={2} className={styles.parents__title}>
          Все родители
        </Title>
        <div className={styles.parents__controls}>
          <Input
            placeholder="Поиск по имени, типу, email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.parents__search}
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showAddModal}
            className={styles.parents__addButton}
          >
            Добавить родителя
          </Button>
        </div>
      </div>

      <div className={styles.parents__tableContainer}>
        <Table
          dataSource={filteredParents}
          columns={columns}
          rowKey={(record) => record.idParent.toString()}
          loading={loading}
          className={styles.parents__table}
          scroll={{ x: 1200 }}
        />
      </div>

      {/* Add Parent Modal */}
      <Modal
        title="Добавить нового родителя"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Добавить"
        cancelText="Отмена"
        className={styles.parents__modal}
        width={800}
      >
        <Form form={form} layout="vertical" className={styles.parents__form}>
          <Divider orientation="left">Основная информация</Divider>

          <div className={styles.parents__formRow}>
            <Form.Item
              name="lastName"
              label="Фамилия"
              rules={[{ required: true, message: "Введите фамилию" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="firstName"
              label="Имя"
              rules={[{ required: true, message: "Введите имя" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="middleName"
              label="Отчество"
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <div className={styles.parents__formRow}>
            <Form.Item
              name="gender"
              label="Пол"
              rules={[{ required: true, message: "Выберите пол" }]}
              className={styles.parents__formItem}
            >
              <Select>
                <Option value="male">Мужской</Option>
                <Option value="female">Женский</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="parentType"
              label="Тип родителя"
              rules={[{ required: true, message: "Выберите тип родителя" }]}
              className={styles.parents__formItem}
            >
              <Select>
                <Option value="Mother">Мать</Option>
                <Option value="Father">Отец</Option>
                <Option value="Guardian">Опекун</Option>
                <Option value="Other">Другое</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="phone"
              label="Телефон"
              rules={[{ required: true, message: "Введите телефон" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <div className={styles.parents__formRow}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Введите email" },
                { type: "email", message: "Введите корректный email" },
              ]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="login"
              label="Логин"
              rules={[{ required: true, message: "Введите логин" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <Divider orientation="left">Рабочая информация</Divider>

          <div className={styles.parents__formRow}>
            <Form.Item
              name="workplace"
              label="Место работы"
              rules={[{ required: true, message: "Введите место работы" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="position"
              label="Должность"
              rules={[{ required: true, message: "Введите должность" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="workPhone"
              label="Рабочий телефон"
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <Divider orientation="left">Документы и адрес</Divider>

          <div className={styles.parents__formRow}>
            <Form.Item
              name="passportSeries"
              label="Серия паспорта"
              rules={[{ required: true, message: "Введите серию паспорта" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="passportNumber"
              label="Номер паспорта"
              rules={[{ required: true, message: "Введите номер паспорта" }]}
              className={styles.parents__formItem}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="registrationAddress"
            label="Адрес регистрации"
            rules={[{ required: true, message: "Введите адрес регистрации" }]}
            className={styles.parents__formItem}
          >
            <TextArea rows={2} />
          </Form.Item>

          <Divider orientation="left">Дети</Divider>

          <Form.Item
            label="Выберите детей"
            rules={[
              { required: true, message: "Выберите хотя бы одного ребенка" },
            ]}
            className={styles.parents__formItem}
          >
            <Transfer
              dataSource={students.map((student) => ({
                key: student.student.idStudent.toString(),
                title: `${student.student.lastName} ${
                  student.student.firstName
                } ${student.student.middleName || ""} (${
                  student.class.classNumber
                }${student.class.classLetter})`,
                description: `Класс ${student.class.classNumber}${student.class.classLetter}`,
              }))}
              titles={["Доступные ученики", "Выбранные ученики"]}
              targetKeys={selectedStudents}
              onChange={handleStudentChange}
              render={(item) => item.title}
              listStyle={{
                width: 350,
                height: 300,
              }}
              className={styles.parents__transfer}
            />
          </Form.Item>

          <Divider orientation="left">Фотография</Divider>

          <Form.Item label="Фотография" className={styles.parents__formItem}>
            <div className={styles.parents__uploadContainer}>
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
                className={styles.parents__uploadButton}
              >
                Выбрать фото
              </Button>
              {photoFile && (
                <Text className={styles.parents__fileName}>
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
