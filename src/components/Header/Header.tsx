import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  HomeOutlined,
  UserOutlined,
  CalendarOutlined,
  BarChartOutlined,
  SettingOutlined,
  LogoutOutlined,
  MailOutlined,
  TeamOutlined,
  BookOutlined,
  UsergroupAddOutlined,
  SolutionOutlined,
  ApartmentOutlined,
  PieChartOutlined,
  IdcardOutlined,
  BankOutlined,
} from "@ant-design/icons";
import { Avatar, Tooltip } from "antd";
import logo from "../../assets/images/logo.png";
import styles from "./Header.module.scss";
import { ShinyText } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../store/userSlice";
import { clearUserData } from "../../api/api-utils";
import { NavLink } from "../../types";

export const Header: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    clearUserData();
    navigate("/auth");
  };

  // Получаем инициалы пользователя для аватара, если нет фото
  const getInitials = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return "U";
  };

  const isLinkActive = (linkPath: string): boolean => {
    // Точное совпадение пути (включая проверку профиля)
    return location.pathname === linkPath;
  };

  // Ссылка на настройки (будет добавлена в конец каждого списка)
  const settingsLink: NavLink = {
    to: "/settings",
    icon: <SettingOutlined />,
    text: "Настройки"
  };

  // Общие ссылки для всех ролей (без настроек)
  const commonLinks: NavLink[] = [
    { to: "/home", icon: <HomeOutlined />, text: "Главная" },
    { to: `/profile/${user.id}`, icon: <UserOutlined />, text: "Профиль" },
    { to: "/schedule", icon: <CalendarOutlined />, text: "Расписание" },
  ];

  // Ссылки для администратора (id роли = 1)
  const adminLinks: NavLink[] = [
    ...commonLinks,
    { to: "/students", icon: <TeamOutlined />, text: "Студенты" },
    { to: "/parents", icon: <UsergroupAddOutlined />, text: "Родители" },
    { to: "/staff", icon: <SolutionOutlined />, text: "Сотрудники" },
    { to: "/subjects", icon: <BookOutlined />, text: "Предметы" },
    { to: "/roles", icon: <IdcardOutlined />, text: "Роли" },
    { to: "/positions", icon: <ApartmentOutlined />, text: "Должности" },
    { to: "/classes", icon: <BankOutlined />, text: "Классы" },
    { to: "/statistics", icon: <PieChartOutlined />, text: "Статистика" },
    settingsLink, // Добавляем настройки в конец
  ];

  // Ссылки для учителя (id роли = 2)
  const teacherLinks: NavLink[] = [
    ...commonLinks,
    { to: "/grades", icon: <BarChartOutlined />, text: "Оценки" },
    { to: "/students", icon: <TeamOutlined />, text: "Мои студенты" },
    { to: "/subjects", icon: <BookOutlined />, text: "Предметы" },
    settingsLink, // Добавляем настройки в конец
  ];

  // Ссылки для студента (id роли = 3)
  const studentLinks: NavLink[] = [
    ...commonLinks,
    { to: "/grades", icon: <BarChartOutlined />, text: "Мои оценки" },
    { to: "/subjects", icon: <BookOutlined />, text: "Предметы" },
    // { to: "/achievements", icon: <TrophyOutlined />, text: "Достижения" },
    settingsLink, // Добавляем настройки в конец
  ];

  // Ссылки для родителя (id роли = 4)
  const parentLinks: NavLink[] = [
    ...commonLinks,
    { to: "/children", icon: <TeamOutlined />, text: "Мои дети" },
    { to: "/grades", icon: <BarChartOutlined />, text: "Оценки детей" },
    { to: "/teachers", icon: <SolutionOutlined />, text: "Учителя" },
    settingsLink, // Добавляем настройки в конец
  ];

  // Выбор набора ссылок в зависимости от роли пользователя
  const getNavLinks = (): NavLink[] => {
    const roleId = user.role?.id;

    switch (roleId) {
      case 1:
        return adminLinks;
      case 2:
        return teacherLinks;
      case 3:
        return studentLinks;
      case 4:
        return parentLinks;
      default:
        return [...commonLinks, settingsLink]; // Для неизвестной роли тоже добавляем настройки в конец
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebar__logo}>
        <img src={logo} alt="Logo" className={styles["sidebar__logo-img"]} />
        <ShinyText
          text="Internation school"
          className={styles["sidebar__logo-text"]}
          fontSizes={1.5}
        />
      </div>

      <nav className={styles.sidebar__nav}>
        <ul>
          {navLinks.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`${styles["sidebar__nav-link"]} ${
                  isLinkActive(link.to)
                    ? styles["sidebar__nav-link--active"]
                    : ""
                }`}
              >
                {link.icon}
                &nbsp;&nbsp;{link.text}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.sidebar__footer}>
        <div className={styles.sidebar__user}>
          <div className={styles["sidebar__user-avatar"]}>
            {user.photo ? (
              <Avatar
                src={user.photo}
                size={64}
                className={styles["sidebar__user-avatar-img"]}
              />
            ) : (
              <Avatar size={64} className={styles["sidebar__user-avatar-img"]}>
                {getInitials()}
              </Avatar>
            )}
          </div>
          <div className={styles["sidebar__user-info"]}>
            <h3 className={styles["sidebar__user-name"]}>
              {user.firstName} {user.lastName}
            </h3>
            {user.role && (
              <p className={styles["sidebar__user-middle-name"]}>
                {user.role.name}
              </p>
            )}
            <Tooltip title={user.email}>
              <p className={styles["sidebar__user-email"]}>
                <MailOutlined/> {user.email}
              </p>
            </Tooltip>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className={styles["sidebar__logout-btn"]}
        >
          <LogoutOutlined style={{ transform: "rotateZ(-90deg)" }} />
          &nbsp;&nbsp;Выйти
        </button>
      </div>
    </div>
  );
};
