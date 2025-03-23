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
  Empty,
  Skeleton,
  Avatar,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  ApartmentOutlined,
  TeamOutlined,
  BulbOutlined,
  BookOutlined,
  ToolOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  BankOutlined,
} from "@ant-design/icons";
import styles from "./Positions.module.scss";
import { getAllPositions, createPosition, deletePositionById } from "../../api/api-utils";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface PositionData {
  idPosition: number;
  name: string;
  description: string;
}

export const Positions: React.FC = () => {
  const [positions, setPositions] = useState<PositionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState<string>("");
  const [filteredPositions, setFilteredPositions] = useState<PositionData[]>([]);
  const token = localStorage.getItem("accessToken") || "";

  // Load positions data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllPositions(token);
        setPositions(response.positions);
        setFilteredPositions(response.positions);
      } catch (error) {
        console.error("Error fetching positions:", error);
        message.error("Не удалось загрузить данные о должностях");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter positions based on search text
  useEffect(() => {
    if (!searchText) {
      setFilteredPositions(positions);
      return;
    }

    const searchLower = searchText.toLowerCase();
    const filtered = positions.filter(
      (position) =>
        position.name.toLowerCase().includes(searchLower) ||
        position.description.toLowerCase().includes(searchLower)
    );

    setFilteredPositions(filtered);
  }, [searchText, positions]);

  // Show add position modal
  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle form submission for new position
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      setLoading(true);
      await createPosition({
        name: values.name,
        description: values.description
      }, token);
      
      message.success('Должность успешно добавлена');
      setIsModalVisible(false);
      
      // Refresh positions list
      const response = await getAllPositions(token);
      setPositions(response.positions);
      setFilteredPositions(response.positions);
    } catch (error) {
      console.error('Error adding position:', error);
      message.error('Не удалось добавить должность');
    } finally {
      setLoading(false);
    }
  };

  // Delete position
  const handleDeletePosition = async (positionId: number) => {
    try {
      setLoading(true);
      await deletePositionById(positionId, token);
      message.success("Должность успешно удалена");

      // Refresh positions list
      const response = await getAllPositions(token);
      setPositions(response.positions);
      setFilteredPositions(response.positions);
    } catch (error) {
      console.error("Error deleting position:", error);
      message.error("Не удалось удалить должность");
    } finally {
      setLoading(false);
    }
  };

  // Get position icon based on position name
  const getPositionIcon = (positionName: string) => {
    const name = positionName.toLowerCase();
    if (name.includes("teacher")) return <BookOutlined />;
    if (name.includes("admin")) return <ApartmentOutlined />;
    if (name.includes("principal")) return <BankOutlined />;
    if (name.includes("counselor")) return <TeamOutlined />;
    if (name.includes("nurse")) return <MedicineBoxOutlined />;
    if (name.includes("librarian")) return <BookOutlined />;
    if (name.includes("janitor") || name.includes("maintenance")) return <ToolOutlined />;
    if (name.includes("scientist") || name.includes("lab")) return <ExperimentOutlined />;
    if (name.includes("coach") || name.includes("physical")) return <TeamOutlined />;
    return <BulbOutlined />;
  };

  // Get position color based on position name
  const getPositionColor = (positionName: string) => {
    const name = positionName.toLowerCase();
    if (name.includes("teacher")) return "blue";
    if (name.includes("admin")) return "gold";
    if (name.includes("principal")) return "purple";
    if (name.includes("counselor")) return "cyan";
    if (name.includes("nurse")) return "red";
    if (name.includes("librarian")) return "green";
    if (name.includes("janitor") || name.includes("maintenance")) return "orange";
    if (name.includes("scientist") || name.includes("lab")) return "geekblue";
    if (name.includes("coach") || name.includes("physical")) return "lime";
    return "magenta";
  };

  // Get avatar background color based on position name
  const getAvatarColor = (positionName: string) => {
    const name = positionName.toLowerCase();
    if (name.includes("teacher")) return "#1890ff";
    if (name.includes("admin")) return "#faad14";
    if (name.includes("principal")) return "#722ed1";
    if (name.includes("counselor")) return "#13c2c2";
    if (name.includes("nurse")) return "#f5222d";
    if (name.includes("librarian")) return "#52c41a";
    if (name.includes("janitor") || name.includes("maintenance")) return "#fa8c16";
    if (name.includes("scientist") || name.includes("lab")) return "#2f54eb";
    if (name.includes("coach") || name.includes("physical")) return "#a0d911";
    return "#eb2f96";
  };

  // Table columns
  const columns = [
    {
      title: "ID",
      dataIndex: "idPosition",
      key: "idPosition",
      width: 80,
      sorter: (a: PositionData, b: PositionData) => a.idPosition - b.idPosition,
      render: (id: number) => (
        <Badge 
          count={id} 
          style={{ 
            backgroundColor: '#1890ff',
            fontSize: '14px',
            fontWeight: 'bold',
            minWidth: '32px',
            height: '32px',
            lineHeight: '32px',
            borderRadius: '16px'
          }} 
        />
      ),
    },
    {
      title: "Иконка",
      key: "icon",
      width: 80,
      render: (record: PositionData) => (
        <Avatar
          size={40}
          icon={getPositionIcon(record.name)}
          style={{ backgroundColor: getAvatarColor(record.name) }}
          className={styles.positions__avatar}
        />
      ),
    },
    {
      title: "Название должности",
      dataIndex: "name",
      key: "name",
      sorter: (a: PositionData, b: PositionData) => a.name.localeCompare(b.name),
      render: (name: string) => (
        <div className={styles.positions__nameContainer}>
          <Tag color={getPositionColor(name)} className={styles.positions__positionTag}>
            {name}
          </Tag>
        </div>
      ),
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (description: string) => (
        <Paragraph 
          ellipsis={{ rows: 2, expandable: true, symbol: 'Подробнее' }}
          className={styles.positions__description}
        >
          {description}
        </Paragraph>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 120,
      render: (record: PositionData) => (
        <Space size="small" className={styles.positions__actions}>
          <Tooltip title="Удалить должность">
            <Popconfirm
              title="Вы уверены, что хотите удалить эту должность?"
              onConfirm={() => handleDeletePosition(record.idPosition)}
              okText="Да"
              cancelText="Нет"
              placement="left"
            >
              <Button
                danger
                icon={<DeleteOutlined />}
                className={styles.positions__actionButton}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.positions}>
      <div className={styles.positions__header}>
        <Title level={2} className={styles.positions__title}>
          Управление должностями
        </Title>
        <div className={styles.positions__controls}>
          <Input
            placeholder="Поиск по названию или описанию..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            prefix={<SearchOutlined />}
            className={styles.positions__search}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={showAddModal}
            className={styles.positions__addButton}
          >
            Добавить должность
          </Button>
        </div>
      </div>

      <div className={styles.positions__statsContainer}>
        <Card className={styles.positions__statsCard}>
          <div className={styles.positions__statsIcon}>
            <ApartmentOutlined />
          </div>
          <div className={styles.positions__statsContent}>
            <Text className={styles.positions__statsTitle}>Всего должностей</Text>
            <Text className={styles.positions__statsValue}>{positions.length}</Text>
          </div>
        </Card>
      </div>

      {loading && positions.length === 0 ? (
        <div className={styles.positions__skeletonContainer}>
          <Skeleton active avatar paragraph={{ rows: 4 }} />
          <Skeleton active avatar paragraph={{ rows: 4 }} />
          <Skeleton active avatar paragraph={{ rows: 4 }} />
        </div>
      ) : positions.length === 0 ? (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Нет доступных должностей"
          className={styles.positions__empty}
        >
          <Button type="primary" onClick={showAddModal}>
            Добавить должность
          </Button>
        </Empty>
      ) : (
        <div className={styles.positions__tableContainer}>
          <Table
            dataSource={filteredPositions}
            columns={columns}
            rowKey={(record) => record.idPosition.toString()}
            loading={loading}
            className={styles.positions__table}
            pagination={{
              showTotal: (total) => `Всего ${total} должностей`,
            }}
          />
        </div>
      )}

      {/* Position Cards View (Alternative to Table) */}
      <div className={styles.positions__cardsContainer}>
        {filteredPositions.map(position => (
          <Card 
            key={position.idPosition}
            className={styles.positions__positionCard}
            actions={[
              <Popconfirm
                title="Вы уверены, что хотите удалить эту должность?"
                onConfirm={() => handleDeletePosition(position.idPosition)}
                okText="Да"
                cancelText="Нет"
              >
                <DeleteOutlined key="delete" />
              </Popconfirm>
            ]}
          >
            <div className={styles.positions__cardHeader}>
              <Avatar
                size={60}
                icon={getPositionIcon(position.name)}
                style={{ backgroundColor: getAvatarColor(position.name) }}
              />
              <div className={styles.positions__cardTitle}>
                <Text strong className={styles.positions__cardName}>
                  {position.name}
                </Text>
                <Tag color={getPositionColor(position.name)}>
                  ID: {position.idPosition}
                </Tag>
              </div>
            </div>
            <Paragraph className={styles.positions__cardDescription}>
              {position.description}
            </Paragraph>
          </Card>
        ))}
      </div>

      {/* Add Position Modal */}
      <Modal
        title="Добавить новую должность"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSubmit}
        okText="Добавить"
        cancelText="Отмена"
        className={styles.positions__modal}
      >
        <Form form={form} layout="vertical" className={styles.positions__form}>
          <Form.Item
            name="name"
            label="Название должности"
            rules={[
              { required: true, message: "Введите название должности" },
              { min: 2, message: "Название должности должно содержать минимум 2 символа" },
              {
                validator: (_, value) => {
                  if (value && positions.some(position => position.name.toLowerCase() === value.toLowerCase())) {
                    return Promise.reject(new Error('Такая должность уже существует'));
                  }
                  return Promise.resolve();
                },
              }
            ]}
            className={styles.positions__formItem}
          >
            <Input placeholder="Например: Учитель, Директор, Библиотекарь" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Описание должности"
            rules={[
              { required: true, message: "Введите описание должности" },
              { min: 10, message: "Описание должно содержать минимум 10 символов" }
            ]}
            className={styles.positions__formItem}
          >
            <TextArea 
              rows={4} 
              placeholder="Опишите обязанности и ответственности данной должности"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
