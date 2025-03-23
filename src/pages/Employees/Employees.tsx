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
  Tabs,
  Divider,
  Card,
  InputNumber,
  Switch,
  List,
  Tooltip,
} from "antd";
import {
  UserAddOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
  BookOutlined,
  IdcardOutlined,
  BankOutlined,
  ApartmentOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  HomeOutlined,
  ClockCircleOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./Employees.module.scss";
import {
  getAllEmployees,
  deleteEmployeeById,
  registrationUser,
  createEducation,
  getAllEducationSettings,
  getEmployeeEducationByEmployeeId,
  getAllPositions,
  getAllRoles,
} from "../../api/api-utils";

const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

interface EmployeeData {
  idEmployee: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: "male" | "female";
  photo: string | null;
  position: {
    idPosition: number;
    name: string;
  };
  role: {
    id: number;
    name: string;
  };
  maritalStatus: string;
  birthDate: string;
  phone: string;
  isStaff: boolean;
  passportSeries: string;
  passportNumber: string;
  workBookNumber: string;
  registrationAddress: string;
  workExperience: number;
  hireDate: string;
}

interface EducationLevel {
  idEducationLevel: number;
  name: string;
}

interface EducationalInstitution {
  idEducationalInstitution: number;
  name: string;
}

interface Specialty {
  idSpecialty: number;
  name: string;
}

interface EducationSettings {
  educationLevels: EducationLevel[];
  educationalInstitutions: EducationalInstitution[];
  specialties: Specialty[];
}

interface EmployeeEducation {
  idEmployeeEducation: number;
  employee: {
    idEmployee: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
  };
  educationLevel: {
    idEducationLevel: number;
    name: string;
  };
  educationalInstitution: {
    idEducationalInstitution: number;
    name: string;
  };
  specialty: {
    idSpecialty: number;
    name: string;
  };
  graduationYear: number;
}

interface Position {
  idPosition: number;
  name: string;
}

interface Role {
  id: number;
  name: string;
}

export const Employees: React.FC = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<EmployeeData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [positions, setPositions] = useState<Position[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isEducationModalVisible, setIsEducationModalVisible] =
    useState<boolean>(false);
  const [form] = Form.useForm();
  const [educationForm] = Form.useForm();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeData[]>(
    []
  );
  const [educationSettings, setEducationSettings] =
    useState<EducationSettings | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(
    null
  );
  const [employeeEducations, setEmployeeEducations] = useState<
    EmployeeEducation[]
  >([]);
  const token = localStorage.getItem("accessToken") || "";
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate a random password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  // Load employees data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const employeesResponse = await getAllEmployees(token);
        const educationSettingsResponse = await getAllEducationSettings(token);
        const positionsResponse = await getAllPositions(token);
        const rolesResponse = await getAllRoles(token);

        setPositions(positionsResponse.positions);
        setRoles(rolesResponse);
        setEmployees(employeesResponse);
        setFilteredEmployees(employeesResponse);
        setEducationSettings(educationSettingsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Не удалось загрузить данные");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter employees based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredEmployees(employees);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = employees.filter(
      (item) =>
        item.firstName.toLowerCase().includes(searchLower) ||
        item.lastName.toLowerCase().includes(searchLower) ||
        (item.middleName &&
          item.middleName.toLowerCase().includes(searchLower)) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.position.name.toLowerCase().includes(searchLower) ||
        item.role.name.toLowerCase().includes(searchLower)
    );

    setFilteredEmployees(filtered);
  }, [searchText, employees]);

  // Navigate to employee profile
  const handleViewProfile = (employeeId: number, isStaff: boolean) => {
    if (!isStaff) {
      message.warning("Нельзя просмотреть профиль уволенного сотрудника");
      return;
    }
    navigate(`/profile/${employeeId}`, { state: { role: 1 } });
  };

  // Delete employee
  const handleDeleteEmployee = async (employeeId: number, isStaff: boolean) => {
    if (!isStaff) {
      message.warning("Нельзя удалить уволенного сотрудника");
      return;
    }

    try {
      setLoading(true);
      await deleteEmployeeById(employeeId, token);
      message.success("Сотрудник успешно удален");

      // Refresh employees list
      const updatedEmployees = await getAllEmployees(token);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error deleting employee:", error);
      message.error("Не удалось удалить сотрудника");
    } finally {
      setLoading(false);
    }
  };

  // Show add employee modal
  const showAddModal = () => {
    form.resetFields();
    setPhotoFile(null);
    // Set a generated password in the form
    form.setFieldsValue({
      password: generatePassword(),
      isStaff: true,
    });
    setIsModalVisible(true);
  };

  // Handle form submission for new employee
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
      formData.append("idRole", values.idRole);
      formData.append("idPosition", values.idPosition);
      formData.append("maritalStatus", values.maritalStatus);
      formData.append("birthDate", values.birthDate.format("YYYY-MM-DD"));
      formData.append("phone", values.phone);
      formData.append("isStaff", values.isStaff.toString());
      formData.append("passportSeries", values.passportSeries);
      formData.append("passportNumber", values.passportNumber);
      formData.append("workBookNumber", values.workBookNumber);
      formData.append("registrationAddress", values.registrationAddress);
      formData.append("workExperience", values.workExperience.toString());
      formData.append("hireDate", values.hireDate.format("YYYY-MM-DD"));

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      setLoading(true);
      const response = await registrationUser(formData, "employee", token);

      message.success("Сотрудник успешно добавлен");
      message.info(`Пароль для входа: ${generatedPassword}`);
      setIsModalVisible(false);

      // Set the newly created employee ID for adding education
      setSelectedEmployeeId(response.idEmployee);

      // Show education modal
      setIsEducationModalVisible(true);

      // Refresh employees list
      const updatedEmployees = await getAllEmployees(token);
      setEmployees(updatedEmployees);
      setFilteredEmployees(updatedEmployees);
    } catch (error) {
      console.error("Error adding employee:", error);
      message.error("Не удалось добавить сотрудника");
    } finally {
      setLoading(false);
    }
  };

  // Show education modal for existing employee
  const showEducationModal = async (employeeId: number, isStaff: boolean) => {
    if (!isStaff) {
      message.warning("Нельзя добавить образование уволенному сотруднику");
      return;
    }

    try {
      setLoading(true);
      setSelectedEmployeeId(employeeId);

      // Fetch employee's education data
      const educationResponse = await getEmployeeEducationByEmployeeId(
        employeeId,
        token
      );
      setEmployeeEducations(educationResponse.employeeEducation || []);

      // Reset education form
      educationForm.resetFields();

      setIsEducationModalVisible(true);
    } catch (error) {
      console.error("Error fetching employee education:", error);
      message.error("Не удалось загрузить данные об образовании");
    } finally {
      setLoading(false);
    }
  };

  // Handle education form submission
  const handleEducationSubmit = async () => {
    try {
      if (!selectedEmployeeId) {
        message.error("ID сотрудника не определен");
        return;
      }

      const values = await educationForm.validateFields();

      const educationData = {
        idEmployee: selectedEmployeeId,
        idEducationLevel: values.idEducationLevel,
        idEducationalInstitution: values.idEducationalInstitution,
        idSpecialty: values.idSpecialty,
        graduationYear: values.graduationYear,
      };

      setLoading(true);
      await createEducation(educationData, token);

      message.success("Образование успешно добавлено");

      // Refresh education data
      const educationResponse = await getEmployeeEducationByEmployeeId(
        selectedEmployeeId,
        token
      );
      setEmployeeEducations(educationResponse.employeeEducation || []);

      // Reset form
      educationForm.resetFields();
    } catch (error) {
      console.error("Error adding education:", error);
      message.error("Не удалось добавить образование");
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

  // Get row class name based on employee status
  const getRowClassName = (record: EmployeeData) => {
    return record.isStaff ? "" : "terminated-employee-row";
  };

  // Table columns
  const columns = [
    {
      title: "Фото",
      dataIndex: "photo",
      key: "photo",
      width: 80,
      render: (photo: string | null, record: EmployeeData) => (
        <Avatar
          size={40}
          src={photo}
          className={`${styles.employees__avatar} ${
            !record.isStaff ? styles["employees__avatar--terminated"] : ""
          }`}
        >
          {!photo && getInitials(record.firstName, record.lastName)}
        </Avatar>
      ),
    },
    {
      title: "ФИО",
      key: "name",
      render: (record: EmployeeData) => (
        <div className={styles.employees__name}>
          <Space>
            <Text strong>
              {record.lastName} {record.firstName}
              {record.middleName && ` ${record.middleName}`}
            </Text>
            {!record.isStaff && (
              <Tag
                icon={<StopOutlined />}
                color="error"
                className={`${styles.employees__statusTag} ${styles["employees__statusTag--terminated"]}`}
              >
                Уволен
              </Tag>
            )}
          </Space>
          <Space size={8}>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <MailOutlined /> {record.email}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              <PhoneOutlined /> {record.phone}
            </Text>
          </Space>
        </div>
      ),
      sorter: (a: EmployeeData, b: EmployeeData) =>
        `${a.lastName} ${a.firstName}`.localeCompare(
          `${b.lastName} ${b.firstName}`
        ),
    },
    {
      title: "Должность и роль",
      key: "position",
      render: (record: EmployeeData) => (
        <div className={styles.employees__infoCard}>
          <Tag
            color="blue"
            className={`${styles.employees__positionTag} ${
              !record.isStaff
                ? styles["employees__positionTag--terminated"]
                : ""
            }`}
          >
            <ApartmentOutlined /> {record.position.name}
          </Tag>
          <Tag
            color="green"
            className={`${styles.employees__positionTag} ${
              !record.isStaff
                ? styles["employees__positionTag--terminated"]
                : ""
            }`}
          >
            <IdcardOutlined /> {record.role.name}
          </Tag>
        </div>
      ),
      sorter: (a: EmployeeData, b: EmployeeData) =>
        a.position.name.localeCompare(b.position.name),
    },
    {
      title: "Личная информация",
      key: "personalInfo",
      render: (record: EmployeeData) => (
        <div className={styles.employees__infoCard}>
          <div className={styles.employees__infoItem}>
            <Tag
              color={record.gender === "male" ? "blue" : "magenta"}
              icon={
                record.gender === "male" ? <ManOutlined /> : <WomanOutlined />
              }
              className={styles.employees__genderTag}
            >
              {record.gender === "male" ? "Мужской" : "Женский"}
            </Tag>
          </div>
          <div className={styles.employees__infoItem}>
            <CalendarOutlined className={styles.employees__infoItemIcon} />
            <span className={styles.employees__infoItemLabel}>
              Дата рождения:
            </span>
            <span className={styles.employees__infoItemValue}>
              {formatDate(record.birthDate)}
            </span>
          </div>
          <div className={styles.employees__infoItem}>
            <HomeOutlined className={styles.employees__infoItemIcon} />
            <span className={styles.employees__infoItemLabel}>Статус:</span>
            <span className={styles.employees__infoItemValue}>
              {record.maritalStatus}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Рабочая информация",
      key: "workInfo",
      render: (record: EmployeeData) => (
        <div className={styles.employees__infoCard}>
          <div className={styles.employees__infoItem}>
            <ClockCircleOutlined className={styles.employees__infoItemIcon} />
            <span className={styles.employees__infoItemLabel}>Стаж:</span>
            <span className={styles.employees__infoItemValue}>
              {record.workExperience}{" "}
              {record.workExperience === 1
                ? "год"
                : record.workExperience >= 2 && record.workExperience <= 4
                ? "года"
                : "лет"}
            </span>
          </div>
          <div className={styles.employees__infoItem}>
            <CalendarOutlined className={styles.employees__infoItemIcon} />
            <span className={styles.employees__infoItemLabel}>Дата найма:</span>
            <span className={styles.employees__infoItemValue}>
              {formatDate(record.hireDate)}
            </span>
          </div>
          <div className={styles.employees__infoItem}>
            <BankOutlined className={styles.employees__infoItemIcon} />
            <span className={styles.employees__infoItemLabel}>
              Трудовая книжка:
            </span>
            <span className={styles.employees__infoItemValue}>
              {record.workBookNumber}
            </span>
          </div>
        </div>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 240,
      render: (record: EmployeeData) => (
        <Space size="small" className={styles.employees__actions}>
          <Tooltip
            title={
              !record.isStaff
                ? "Нельзя просмотреть профиль уволенного сотрудника"
                : "Просмотреть профиль"
            }
          >
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() =>
                handleViewProfile(record.idEmployee, record.isStaff)
              }
              className={styles.employees__actionButton}
              disabled={!record.isStaff}
            >
              Профиль
            </Button>
          </Tooltip>
          <Tooltip
            title={
              !record.isStaff
                ? "Нельзя добавить образование уволенному сотруднику"
                : "Добавить образование"
            }
          >
            <Button
              icon={<BookOutlined />}
              onClick={() =>
                showEducationModal(record.idEmployee, record.isStaff)
              }
              className={styles.employees__actionButton}
              disabled={!record.isStaff}
            >
              Образование
            </Button>
          </Tooltip>
          <Tooltip
            title={
              !record.isStaff
                ? "Нельзя удалить уволенного сотрудника"
                : "Удалить сотрудника"
            }
          >
            <Popconfirm
              title="Вы уверены, что хотите удалить этого сотрудника?"
              onConfirm={() =>
                handleDeleteEmployee(record.idEmployee, record.isStaff)
              }
              okText="Да"
              cancelText="Нет"
              placement="left"
              disabled={!record.isStaff}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                className={styles.employees__actionButton}
                disabled={!record.isStaff}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.employees}>
      <div className={styles.employees__header}>
        <Title level={2} className={styles.employees__title}>
          Все сотрудники
        </Title>
        <div className={styles.employees__controls}>
          <Input
            placeholder="Поиск по имени, должности, email..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.employees__search}
          />
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={showAddModal}
            className={styles.employees__addButton}
          >
            Добавить сотрудника
          </Button>
        </div>
      </div>

      <div className={styles.employees__tableContainer}>
        <Table
          dataSource={filteredEmployees}
          columns={columns}
          rowKey={(record) => record.idEmployee.toString()}
          loading={loading}
          className={styles.employees__table}
          scroll={{ x: 1200 }}
          rowClassName={getRowClassName}
          pagination={{
            showTotal: (total) => `Всего ${total} сотрудников`,
          }}
        />
      </div>

      {/* Add Employee Modal */}
      <Modal
        title="Добавить нового сотрудника"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Добавить"
        cancelText="Отмена"
        className={styles.employees__modal}
        width={800}
      >
        <Form form={form} layout="vertical" className={styles.employees__form}>
          <Tabs defaultActiveKey="1" className={styles.employees__tabs}>
            <TabPane tab="Основная информация" key="1">
              <div className={styles.employees__formRow}>
                <Form.Item
                  name="lastName"
                  label="Фамилия"
                  rules={[{ required: true, message: "Введите фамилию" }]}
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="firstName"
                  label="Имя"
                  rules={[{ required: true, message: "Введите имя" }]}
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="middleName"
                  label="Отчество"
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>
              </div>

              <div className={styles.employees__formRow}>
                <Form.Item
                  name="gender"
                  label="Пол"
                  rules={[{ required: true, message: "Выберите пол" }]}
                  className={styles.employees__formItem}
                >
                  <Select>
                    <Option value="male">Мужской</Option>
                    <Option value="female">Женский</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="birthDate"
                  label="Дата рождения"
                  rules={[
                    { required: true, message: "Выберите дату рождения" },
                  ]}
                  className={styles.employees__formItem}
                >
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="maritalStatus"
                  label="Семейное положение"
                  rules={[
                    { required: true, message: "Выберите семейное положение" },
                  ]}
                  className={styles.employees__formItem}
                >
                  <Select>
                    <Option value="Single">Холост/Не замужем</Option>
                    <Option value="Married">Женат/Замужем</Option>
                    <Option value="Divorced">Разведен(а)</Option>
                    <Option value="Widowed">Вдовец/Вдова</Option>
                  </Select>
                </Form.Item>
              </div>

              <div className={styles.employees__formRow}>
                <Form.Item
                  name="phone"
                  label="Телефон"
                  rules={[{ required: true, message: "Введите телефон" }]}
                  className={styles.employees__formItem}
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
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="login"
                  label="Логин"
                  rules={[{ required: true, message: "Введите логин" }]}
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                label="Фотография"
                className={styles.employees__formItem}
              >
                <div className={styles.employees__uploadContainer}>
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
                    className={styles.employees__uploadButton}
                  >
                    Выбрать фото
                  </Button>
                  {photoFile && (
                    <Text className={styles.employees__fileName}>
                      {photoFile.name}
                    </Text>
                  )}
                </div>
              </Form.Item>
            </TabPane>

            <TabPane tab="Должность и роль" key="2">
              <div className={styles.employees__formRow}>
                <Form.Item
                  name="idPosition"
                  label="Должность"
                  rules={[{ required: true, message: "Выберите должность" }]}
                  className={styles.employees__formItem}
                >
                  <Select>
                    {positions.map((position) => (
                      <Option key={position.idPosition} value={position.idPosition}>
                        {position.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="idRole"
                  label="Роль в системе"
                  rules={[{ required: true, message: "Выберите роль" }]}
                  className={styles.employees__formItem}
                >
                  <Select>
                    {roles.map((role) => (
                      <Option key={role.id} value={role.id}>
                        {role.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="isStaff"
                  label="Является сотрудником"
                  valuePropName="checked"
                  initialValue={true}
                  className={styles.employees__formItem}
                >
                  <Switch
                    checkedChildren={<CheckCircleOutlined />}
                    unCheckedChildren={<StopOutlined />}
                  />
                </Form.Item>
              </div>

              <div className={styles.employees__formRow}>
                <Form.Item
                  name="workExperience"
                  label="Стаж работы (лет)"
                  rules={[{ required: true, message: "Укажите стаж работы" }]}
                  className={styles.employees__formItem}
                >
                  <InputNumber min={0} style={{ width: "100%" }} />
                </Form.Item>

                <Form.Item
                  name="hireDate"
                  label="Дата найма"
                  rules={[{ required: true, message: "Выберите дату найма" }]}
                  className={styles.employees__formItem}
                >
                  <DatePicker format="DD.MM.YYYY" style={{ width: "100%" }} />
                </Form.Item>
              </div>
            </TabPane>

            <TabPane tab="Документы" key="3">
              <div className={styles.employees__formRow}>
                <Form.Item
                  name="passportSeries"
                  label="Серия паспорта"
                  rules={[
                    { required: true, message: "Введите серию паспорта" },
                  ]}
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="passportNumber"
                  label="Номер паспорта"
                  rules={[
                    { required: true, message: "Введите номер паспорта" },
                  ]}
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="workBookNumber"
                  label="Номер трудовой книжки"
                  rules={[
                    {
                      required: true,
                      message: "Введите номер трудовой книжки",
                    },
                  ]}
                  className={styles.employees__formItem}
                >
                  <Input />
                </Form.Item>
              </div>

              <Form.Item
                name="registrationAddress"
                label="Адрес регистрации"
                rules={[
                  { required: true, message: "Введите адрес регистрации" },
                ]}
                className={styles.employees__formItem}
              >
                <Input.TextArea rows={3} />
              </Form.Item>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>

      {/* Education Modal */}
      <Modal
        title="Образование сотрудника"
        visible={isEducationModalVisible}
        onCancel={() => setIsEducationModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsEducationModalVisible(false)}>
            Закрыть
          </Button>,
        ]}
        className={styles.employees__modal}
        width={700}
      >
        {employeeEducations.length > 0 && (
          <>
            <Title level={4}>Текущее образование</Title>
            <List
              className={styles.employees__educationList}
              dataSource={employeeEducations}
              renderItem={(item) => (
                <Card className={styles.employees__educationItem}>
                  <div className={styles.employees__educationTitle}>
                    <BankOutlined /> {item.educationalInstitution.name}
                  </div>
                  <div className={styles.employees__educationDetail}>
                    <span className={styles.employees__educationDetailLabel}>
                      Уровень:
                    </span>
                    <span>{item.educationLevel.name}</span>
                  </div>
                  <div className={styles.employees__educationDetail}>
                    <span className={styles.employees__educationDetailLabel}>
                      Специальность:
                    </span>
                    <span>{item.specialty.name}</span>
                  </div>
                  <div className={styles.employees__educationDetail}>
                    <span className={styles.employees__educationDetailLabel}>
                      Год окончания:
                    </span>
                    <span>{item.graduationYear}</span>
                  </div>
                </Card>
              )}
            />
            <Divider />
          </>
        )}

        <Title level={4}>Добавить образование</Title>
        <Form
          form={educationForm}
          layout="vertical"
          className={styles.employees__form}
        >
          <div className={styles.employees__formRow}>
            <Form.Item
              name="idEducationLevel"
              label="Уровень образования"
              rules={[
                { required: true, message: "Выберите уровень образования" },
              ]}
              className={styles.employees__formItem}
            >
              <Select>
                {educationSettings?.educationLevels.map((level) => (
                  <Option
                    key={level.idEducationLevel}
                    value={level.idEducationLevel}
                  >
                    {level.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="idEducationalInstitution"
              label="Учебное заведение"
              rules={[
                { required: true, message: "Выберите учебное заведение" },
              ]}
              className={styles.employees__formItem}
            >
              <Select>
                {educationSettings?.educationalInstitutions.map(
                  (institution) => (
                    <Option
                      key={institution.idEducationalInstitution}
                      value={institution.idEducationalInstitution}
                    >
                      {institution.name}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </div>

          <div className={styles.employees__formRow}>
            <Form.Item
              name="idSpecialty"
              label="Специальность"
              rules={[{ required: true, message: "Выберите специальность" }]}
              className={styles.employees__formItem}
            >
              <Select>
                {educationSettings?.specialties.map((specialty) => (
                  <Option
                    key={specialty.idSpecialty}
                    value={specialty.idSpecialty}
                  >
                    {specialty.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="graduationYear"
              label="Год окончания"
              rules={[{ required: true, message: "Укажите год окончания" }]}
              className={styles.employees__formItem}
            >
              <InputNumber
                min={1950}
                max={new Date().getFullYear()}
                style={{ width: "100%" }}
              />
            </Form.Item>
          </div>

          <Button
            type="primary"
            onClick={handleEducationSubmit}
            loading={loading}
            className={styles.employees__addButton}
          >
            Добавить образование
          </Button>
        </Form>
      </Modal>
    </div>
  );
};
