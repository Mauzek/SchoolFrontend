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
    `Role: Parent (${profile.parentType})`,
    `Email: ${profile.email}`,
    `Phone: ${profile.phone}`,
  ];
  console.log(profile);
  return (
    <section className={styles.profile}>
      <h1 className={styles.profile__title}>Parent Profile</h1>

      <div className={styles.profile__content}>
        <ProfileHeader
          photo={profile.photo}
          name={fullName}
          details={headerDetails}
          photoAlt="Parent"
        />

        <div className={styles.profile__details}>
          <h3>Personal Information</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Gender:</span>
              <span>{profile.gender}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Login:</span>
              <span>{profile.login}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Work Phone:</span>
              <span>{profile.workPhone || "Not specified"}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Children Count:</span>
              <span>{profile.childrenCount}</span>
            </div>
          </div>

          <h3>Employment Information</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Workplace:</span>
              <span>{profile.workplace}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Position:</span>
              <span>{profile.position}</span>
            </div>
          </div>

          <h3>Document Information</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Passport Series:</span>
              <span>{profile.passportSeries}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Passport Number:</span>
              <span>{profile.passportNumber}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>
                Registration Address:
              </span>
              <span>{profile.registrationAddress}</span>
            </div>
          </div>

          <h3>Children</h3>
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
                  <h4>{`${child.lastName} ${child.firstName} ${
                    child.middleName || ""
                  }`}</h4>
                  <p>Class: {`${child.class.number}${child.class.letter}`}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
