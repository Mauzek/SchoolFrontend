import React from "react";
import { Link } from "react-router-dom";
import { ParentDetails } from "../../../types";
import { ProfileHeader } from "../ProfileHeader/ProfileHeader";
import styles from "./ParentProfile.module.scss";

interface ParentProfileProps {
  profile: ParentDetails;
}

export const ParentProfile: React.FC<ParentProfileProps> = ({ profile }) => {
  const fullName = `${profile.lastName} ${profile.firstName} ${
    profile.middleName || ""
  }`;

  const headerDetails = [
    `Роль: Родитель (${profile.parentType})`,
    `Email: ${profile.email}`,
    `Телефон: ${profile.phone}`,
  ];
  return (
    <section className={styles.profile}>
      <h1 className={styles.profile__title}>Профиль родителя</h1>

      <div className={styles.profile__content}>
        <ProfileHeader
          photo={profile.photo}
          name={fullName}
          details={headerDetails}
          photoAlt="Parent"
        />

        <div className={styles.profile__details}>
          <h3>Личная информация</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Пол:</span>
              <span>{profile.gender}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Login:</span>
              <span>{profile.login}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Рабочий телефон:</span>
              <span>{profile.workPhone || "Не указано"}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Children Count:</span>
              <span>{profile.childrenCount}</span>
            </div>
          </div>

          <h3>Информация о месте работы</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Место работы:</span>
              <span>{profile.workplace}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Должность:</span>
              <span>{profile.position}</span>
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

          <h3>Дети</h3>
          <div className={styles.profile__childrenList}>
            {profile.children.map((child) => (
              <Link
                to={`/profile/${child.id}`}
                state={{ role: child.role.id }}
                key={child.id}
                className={styles.profile__childItem}
              >
                <div className={styles.profile__childPhoto}>
                  {child.photo ? (
                    <img
                      src={child.photo}
                      alt={`${child.firstName} ${child.lastName}`}
                    />
                  ) : (
                    <div className={styles.profile__childPhotoPlaceholder}>
                      {child.firstName[0]}
                      {child.lastName[0]}
                    </div>
                  )}
                </div>
                <div className={styles.profile__childInfo}>
                  <span className={styles.profile__childName}>
                  {`${child.lastName} ${child.firstName}`} {child.middleName || ""}
                  </span>
                  <p>Класс: {`${child.class.number}${child.class.letter}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
