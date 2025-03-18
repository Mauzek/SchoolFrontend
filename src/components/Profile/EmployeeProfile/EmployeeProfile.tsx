import React from "react";
import { EmployeeDetails } from "../../../types";
import { ProfileHeader } from "../ProfileHeader/ProfileHeader";
import styles from "./EmployeeProfile.module.scss";

interface EmployeeProfileProps {
  profile: EmployeeDetails;
}

export const EmployeeProfile: React.FC<EmployeeProfileProps> = ({
  profile,
}) => {
  const fullName = `${profile.lastName} ${profile.firstName} ${
    profile.middleName || ""
  }`;

  const headerDetails = [
    `Должность: ${profile.position.name}`,
    `Роль: ${profile.role.name}`,
    `Email: ${profile.email}`,
    `Телефон: ${profile.phone}`,
  ];

  return (
    <section className={styles.profile}>
      <h1 className={styles.profile__title}>Профиль сотрудника</h1>

      <div className={styles.profile__content}>
        <ProfileHeader
          photo={profile.photo}
          name={fullName}
          details={headerDetails}
          photoAlt="Employee"
        />

        <div className={styles.profile__details}>
          <h3>Личная информация</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Дата рождения:</span>
              <span>{new Date(profile.birthDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Пол:</span>
              <span>{profile.gender}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Семейное положение:</span>
              <span>{profile.maritalStatus}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Login:</span>
              <span>{profile.login}</span>
            </div>
          </div>

          <h3>Информация о сотруднике</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Опыт работы:</span>
              <span>{profile.workExperience} years</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Дата найма:</span>
              <span>{new Date(profile.hireDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Статус:</span>
              <span>{profile.isStaff ? "В штате" : "Уволен"}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Номер трудовой книжки:</span>
              <span>{profile.workBookNumber}</span>
            </div>
          </div>

          <h3>Документы</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Серия паспорта:</span>
              <span>{profile.passportSeries}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Номер паспорта:</span>
              <span>{profile.passportNumber}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>
                Адрес регистрации:
              </span>
              <span>{profile.registrationAddress}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
