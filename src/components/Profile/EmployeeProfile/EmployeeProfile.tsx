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
    `Position: ${profile.position.name}`,
    `Role: ${profile.role.name}`,
    `Email: ${profile.email}`,
    `Phone: ${profile.phone}`,
  ];

  return (
    <section className={styles.profile}>
      <h1 className={styles.profile__title}>Employee Profile</h1>

      <div className={styles.profile__content}>
        <ProfileHeader
          photo={profile.photo}
          name={fullName}
          details={headerDetails}
          photoAlt="Employee"
        />

        <div className={styles.profile__details}>
          <h3>Personal Information</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Birth Date:</span>
              <span>{new Date(profile.birthDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Gender:</span>
              <span>{profile.gender}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Marital Status:</span>
              <span>{profile.maritalStatus}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Login:</span>
              <span>{profile.login}</span>
            </div>
          </div>

          <h3>Employment Details</h3>
          <div className={styles.profile__detailsGrid}>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Work Experience:</span>
              <span>{profile.workExperience} years</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Hire Date:</span>
              <span>{new Date(profile.hireDate).toLocaleDateString()}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Staff Status:</span>
              <span>{profile.isStaff ? "Staff Member" : "Contractor"}</span>
            </div>
            <div className={styles.profile__detailItem}>
              <span className={styles.profile__label}>Work Book Number:</span>
              <span>{profile.workBookNumber}</span>
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
        </div>
      </div>
    </section>
  );
};
