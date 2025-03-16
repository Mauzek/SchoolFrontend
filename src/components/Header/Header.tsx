import React from "react";
import { Link } from "react-router-dom";
import { 
  HomeOutlined, 
  UserOutlined, 
  CalendarOutlined, 
  BarChartOutlined, 
  MessageOutlined, 
  SettingOutlined,
  LogoutOutlined 
} from '@ant-design/icons';
import logo from "../../assets/images/logo.png";
import styles from "./Header.module.scss"; 
import { ShinyText } from "../ShinyText/ShinyText";
import { useLocation } from "react-router-dom";

export const Header: React.FC = () => {

  const location = useLocation();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <img src={logo} alt="Logo" className={styles["sidebar__logo-img"]} />
        <ShinyText text="Internation school" className={styles["sidebar__logo-text"]} fontSizes={1.5} />
      </div>
      
      <nav className={styles.sidebar__nav}>
        <ul>
          <li>
            <Link to="/home" className={`${styles["sidebar__nav-link"]} ${
        location.pathname === "/home" ? styles["sidebar__nav-link--active"] : ""
      }`}>
              <HomeOutlined />&nbsp;&nbsp;Главная
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`${styles["sidebar__nav-link"]} ${
        location.pathname === "/profile" ? styles["sidebar__nav-link--active"] : ""
      }`}>
              <UserOutlined />&nbsp;&nbsp;Профиль
            </Link>
          </li>
          <li>
            <Link to="/schedule" className={`${styles["sidebar__nav-link"]} ${
        location.pathname === "/schedule" ? styles["sidebar__nav-link--active"] : ""
      }`}>
              <CalendarOutlined />&nbsp;&nbsp;Расписание
            </Link>
          </li>
          <li>
            <Link to="/grades" className={`${styles["sidebar__nav-link"]} ${
        location.pathname === "/grades" ? styles["sidebar__nav-link--active"] : ""
      }`}>
              <BarChartOutlined />&nbsp;&nbsp;Оценки
            </Link>
          </li>
          <li>
            <Link to="/messages" className={`${styles["sidebar__nav-link"]} ${
        location.pathname === "/messages" ? styles["sidebar__nav-link--active"] : ""
      }`}>
              <MessageOutlined />&nbsp;&nbsp;Сообщения
            </Link>
          </li>
          <li>
            <Link to="/settings" className={`${styles["sidebar__nav-link"]} ${
        location.pathname === "/settings" ? styles["sidebar__nav-link--active"] : ""
      }`}>
              <SettingOutlined />&nbsp;&nbsp;Настройки
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className={styles.sidebar__footer}>
        <button className={styles["sidebar__logout-btn"]}>
          <LogoutOutlined /> Выйти
        </button>
      </div>
    </div>
  );
};
