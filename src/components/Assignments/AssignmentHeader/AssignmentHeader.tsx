import React from "react";
import styles from "./AssignmentHeader.module.scss";
import { ApiAssignment } from "../../../types";

interface AssignmentHeaderProps {
  assignment: ApiAssignment;
}

export const AssignmentHeader: React.FC<AssignmentHeaderProps> = ({
  assignment,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("ru-RU", options);
  };

  const isOverdue = new Date(assignment.closeTime) < new Date();

  return (
    <header className={styles.header}>
      <h1 className={styles.header__title}>{assignment.title}</h1>
      <div className={styles.header__dates}>
        <div className={styles.header__date}>
          <span className={styles.header__dateLabel}>Открыто: </span>
          <span className={styles.header__dateValue}>
            {formatDate(assignment.openTime)}
          </span>
        </div>
        <div className={styles.header__date}>
          <span className={styles.header__dateLabel}>Закрывается: </span>
          <span className={styles.header__dateValue}>
            {formatDate(assignment.closeTime)}
          </span>
        </div>
        <div className={styles.header__status}>
          <span
            className={`${styles.header__statusBadge} ${
              isOverdue
                ? styles["header__statusBadge--closed"]
                : styles["header__statusBadge--open"]
            }`}
          >
            {isOverdue ? "Закрыто" : "Открыто"}
          </span>
        </div>
      </div>
    </header>
  );
};
