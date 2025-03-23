import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Typography,
  Card,
  Tag,
  Tooltip,
  Badge,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  TeamOutlined,
  UserOutlined,
  ReadOutlined,
  UserSwitchOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import styles from "./Roles.module.scss";
import { getAllRoles, createRole, deleteRoleById } from "../../api/api-utils";

const { Title, Text } = Typography;

interface RoleData {
  id_role: number;
  name: string;
}

export const Roles: React.FC = () => {
  const [roles, setRoles] = useState<RoleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredRoles, setFilteredRoles] = useState<RoleData[]>([]);
  const token = localStorage.getItem("accessToken") || "";

  // Load roles data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rolesResponse = await getAllRoles(token);
        setRoles(rolesResponse);
        setFilteredRoles(rolesResponse);
      } catch (error) {
        console.error("Error fetching roles:", error);
        message.error("Не удалось загрузить данные о ролях");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter roles based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredRoles(roles);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = roles.filter((role) =>
      role.name.toLowerCase().includes(searchLower)
    );

    setFilteredRoles(filtered);
  }, [searchText, roles]);

  // Show add role modal
  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle form submission for new role
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);
      await createRole({ name: values.name }, token);

      message.success("Роль успешно добавлена");
      setIsModalVisible(false);

      // Refresh roles list
      const updatedRoles = await getAllRoles(token);
      setRoles(updatedRoles);
      setFilteredRoles(updatedRoles);
    } catch (error) {
      console.error("Error adding role:", error);
      message.error("Не удалось добавить роль");
    } finally {
      setLoading(false);
    }
  };

  // Delete role
  const handleDeleteRole = async (roleId: number) => {
    // Check if it's a system role (1-4)
    if (roleId <= 4) {
      Modal.warning({
        title: "Невозможно удалить системную роль",
        content:
          "Системные роли (Admin, Teacher, Student, Parent) не могут быть удалены.",
        icon: <ExclamationCircleOutlined />,
      });
      return;
    }

    try {
      setLoading(true);
      await deleteRoleById(roleId, token);
      message.success("Роль успешно удалена");

      // Refresh roles list
      const updatedRoles = await getAllRoles(token);
      setRoles(updatedRoles);
      setFilteredRoles(updatedRoles);
    } catch (error) {
      console.error("Error deleting role:", error);
      message.error("Не удалось удалить роль");
    } finally {
      setLoading(false);
    }
  };

  // Get role icon based on role name
  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return (
          <UserSwitchOutlined style={{ fontSize: "24px", color: "#1890ff" }} />
        );
      case "teacher":
        return <ReadOutlined style={{ fontSize: "24px", color: "#52c41a" }} />;
      case "student":
        return <UserOutlined style={{ fontSize: "24px", color: "#722ed1" }} />;
      case "parent":
        return <TeamOutlined style={{ fontSize: "24px", color: "#fa8c16" }} />;
      default:
        return <TeamOutlined style={{ fontSize: "24px", color: "#f759ab" }} />;
    }
  };

  // Get role color based on role name
  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case "admin":
        return "blue";
      case "teacher":
        return "green";
      case "student":
        return "purple";
      case "parent":
        return "orange";
      default:
        return "pink";
    }
  };

  // Check if role is a system role
  const isSystemRole = (roleId: number) => {
    return roleId <= 4;
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id_role",
      key: "id_role",
      width: 80,
      sorter: (a: RoleData, b: RoleData) => a.id_role - b.id_role,
      render: (id: number) => (
        <Badge
          count={id}
          style={{
            backgroundColor: isSystemRole(id) ? "#1890ff" : "#52c41a",
            fontSize: "14px",
            fontWeight: "bold",
            minWidth: "32px",
            height: "32px",
            lineHeight: "32px",
            borderRadius: "16px",
          }}
        />
      ),
    },
    {
      title: "Иконка",
      key: "icon",
      width: 80,
      render: (record: RoleData) => (
        <div className={styles.roles__iconContainer}>
          {getRoleIcon(record.name)}
        </div>
      ),
    },
    {
      title: "Название роли",
      dataIndex: "name",
      key: "name",
      sorter: (a: RoleData, b: RoleData) => a.name.localeCompare(b.name),
      render: (name: string, record: RoleData) => (
        <div className={styles.roles__nameContainer}>
          <Tag color={getRoleColor(name)} className={styles.roles__roleTag}>
            {name}
          </Tag>
          {isSystemRole(record.id_role) && (
            <Tag color="cyan" className={styles.roles__systemTag}>
              Системная
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Описание",
      key: "description",
      render: (record: RoleData) => {
        let description = "";
        switch (record.name.toLowerCase()) {
          case "admin":
            description =
              "Полный доступ к системе, управление пользователями и настройками";
            break;
          case "teacher":
            description =
              "Доступ к расписанию, оценкам, управление классами и предметами";
            break;
          case "student":
            description = "Просмотр расписания, оценок, домашних заданий";
            break;
          case "parent":
            description =
              "Просмотр информации о детях, их оценках и расписании";
            break;
          default:
            description = "Пользовательская роль с настраиваемыми правами";
        }

        return <Text className={styles.roles__description}>{description}</Text>;
      },
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (record: RoleData) => (
        <Space size="small" className={styles.roles__actions}>
          <Tooltip
            title={
              isSystemRole(record.id_role)
                ? "Нельзя удалить системную роль"
                : "Удалить роль"
            }
          >
            <Popconfirm
              title="Вы уверены, что хотите удалить эту роль?"
              onConfirm={() => handleDeleteRole(record.id_role)}
              okText="Да"
              cancelText="Нет"
              placement="left"
              disabled={isSystemRole(record.id_role)}
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                className={styles.roles__actionButton}
                disabled={isSystemRole(record.id_role)}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.roles}>
      <div className={styles.roles__header}>
        <Title level={2} className={styles.roles__title}>
          Управление ролями
        </Title>
        <div className={styles.roles__controls}>
          <Input
            placeholder="Поиск по названию роли..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.roles__search}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className={styles.roles__addButton}
          >
            Добавить роль
          </Button>
        </div>
      </div>

      <div className={styles.roles__statsContainer}>
        <Card className={styles.roles__statsCard}>
          <div className={styles.roles__statsIcon}>
            <TeamOutlined />
          </div>
          <div className={styles.roles__statsContent}>
            <Text className={styles.roles__statsTitle}>Всего ролей</Text>
            <Text className={styles.roles__statsValue}>{roles.length}</Text>
          </div>
        </Card>
        <Card className={styles.roles__statsCard}>
          <div
            className={styles.roles__statsIcon}
            style={{ backgroundColor: "#e6f7ff" }}
          >
            <UserSwitchOutlined style={{ color: "#1890ff" }} />
          </div>
          <div className={styles.roles__statsContent}>
            <Text className={styles.roles__statsTitle}>Системные роли</Text>
            <Text className={styles.roles__statsValue}>
              {roles.filter((role) => isSystemRole(role.id_role)).length}
            </Text>
          </div>
        </Card>
        <Card className={styles.roles__statsCard}>
          <div
            className={styles.roles__statsIcon}
            style={{ backgroundColor: "#f6ffed" }}
          >
            <PlusOutlined style={{ color: "#52c41a" }} />
          </div>
          <div className={styles.roles__statsContent}>
            <Text className={styles.roles__statsTitle}>
              Пользовательские роли
            </Text>
            <Text className={styles.roles__statsValue}>
              {roles.filter((role) => !isSystemRole(role.id_role)).length}
            </Text>
          </div>
        </Card>
      </div>

      <div className={styles.roles__tableContainer}>
        <Table
          dataSource={filteredRoles}
          columns={columns}
          rowKey={(record) => record.id_role.toString()}
          loading={loading}
          className={styles.roles__table}
          pagination={{
            showTotal: (total) => `Всего ${total} ролей`,
          }}
        />
      </div>

      {/* Add Role Modal */}
      <Modal
        title="Добавить новую роль"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Добавить"
        cancelText="Отмена"
        className={styles.roles__modal}
      >
        <Form form={form} layout="vertical" className={styles.roles__form}>
          <Form.Item
            name="name"
            label="Название роли"
            rules={[
              { required: true, message: "Введите название роли" },
              {
                min: 3,
                message: "Название роли должно содержать минимум 3 символа",
              },
              {
                validator: (_, value) => {
                  if (
                    value &&
                    roles.some(
                      (role) => role.name.toLowerCase() === value.toLowerCase()
                    )
                  ) {
                    return Promise.reject(
                      new Error("Такая роль уже существует")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
            className={styles.roles__formItem}
          >
            <Input placeholder="Например: Manager, Assistant, Librarian" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
