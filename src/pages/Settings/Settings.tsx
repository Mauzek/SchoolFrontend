import React, { useState } from 'react';
import {
  Card,
  Typography,
  Tabs,
  Switch,
  Select,
  Divider,
  Radio,
  Alert,
  Space
} from 'antd';
import {
  UserOutlined,
  BgColorsOutlined,
  BellOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import styles from './Settings.module.scss';

const { Title, Text } = Typography;
const { Option } = Select;

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('display');
  
  // Заглушки для настроек
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState('medium');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [language, setLanguage] = useState('ru');

  return (
    <div className={styles.settings}>
      <div className={styles.settings__header}>
        <Title level={2} className={styles.settings__title}>
          Настройки
        </Title>
      </div>

      <Card className={styles.settings__card}>
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab}
          className={styles.settings__tabs}
          items={[
            {
              key: 'display',
              label: (
                <span>
                  <BgColorsOutlined /> Внешний вид
                </span>
              ),
              children: (
                <div className={styles.settings__section}>
                  <Title level={4}>Тема оформления</Title>
                  <div className={styles.settings__option}>
                    <Text>Темная тема</Text>
                    <Switch 
                      checked={darkMode} 
                      onChange={setDarkMode} 
                    />
                  </div>
                  
                  <div className={styles.settings__option}>
                    <Text>Размер шрифта</Text>
                    <Select 
                      value={fontSize} 
                      onChange={setFontSize}
                      style={{ width: 200 }}
                    >
                      <Option value="small">Маленький</Option>
                      <Option value="medium">Средний</Option>
                      <Option value="large">Большой</Option>
                    </Select>
                  </div>
                  
                  <Alert
                    message="Информация"
                    description="Настройки внешнего вида сохраняются автоматически и применяются только к текущему устройству."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </div>
              ),
            },
            {
              key: 'notifications',
              label: (
                <span>
                  <BellOutlined /> Уведомления
                </span>
              ),
              children: (
                <div className={styles.settings__section}>
                  <Title level={4}>Настройки уведомлений</Title>
                  
                  <div className={styles.settings__option}>
                    <Text>Уведомления в системе</Text>
                    <Switch 
                      checked={notifications} 
                      onChange={setNotifications} 
                    />
                  </div>
                  
                  <div className={styles.settings__option}>
                    <Text>Уведомления по email</Text>
                    <Switch 
                      checked={emailNotifications} 
                      onChange={setEmailNotifications} 
                    />
                  </div>
                  
                  <Alert
                    message="Примечание"
                    description="Настройки уведомлений применяются ко всем типам событий в системе."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </div>
              ),
            },
            {
              key: 'language',
              label: (
                <span>
                  <UserOutlined /> Язык
                </span>
              ),
              children: (
                <div className={styles.settings__section}>
                  <Title level={4}>Язык интерфейса</Title>
                  
                  <Radio.Group 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <Space direction="vertical">
                      <Radio value="ru">Русский</Radio>
                      <Radio value="en">English</Radio>
                    </Space>
                  </Radio.Group>
                  
                  <Alert
                    message="Примечание"
                    description="Изменение языка интерфейса требует перезагрузки страницы."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </div>
              ),
            },
            {
              key: 'about',
              label: (
                <span>
                  <InfoCircleOutlined /> О системе
                </span>
              ),
              children: (
                <div className={styles.settings__section}>
                  <Title level={4}>Информация о системе</Title>
                  
                  <div className={styles.settings__infoRow}>
                    <Text strong>Название:</Text>
                    <Text>Школьная информационная система</Text>
                  </div>
                  
                  <div className={styles.settings__infoRow}>
                    <Text strong>Версия:</Text>
                    <Text>1.0.0</Text>
                  </div>
                  
                  <div className={styles.settings__infoRow}>
                    <Text strong>Дата сборки:</Text>
                    <Text>01.06.2023</Text>
                  </div>
                  
                  <Divider />
                  
                  <div className={styles.settings__infoRow}>
                    <Text strong>Разработчик:</Text>
                    <Text>Команда SchoolFrontend</Text>
                  </div>
                  
                  <div className={styles.settings__infoRow}>
                    <Text strong>Контакт:</Text>
                    <Text>support@schoolfrontend.com</Text>
                  </div>
                </div>
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};
