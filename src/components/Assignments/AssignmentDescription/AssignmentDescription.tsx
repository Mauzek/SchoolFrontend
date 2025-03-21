import React from "react";
import styles from "./AssignmentDescription.module.scss";
import { ApiAssignment } from "../../../types";

interface AssignmentDescriptionProps {
  assignment: ApiAssignment;
}

export const AssignmentDescription: React.FC<AssignmentDescriptionProps> = ({
  assignment,
}) => {
  return (
    <section className={styles.description}>
      <h2 className={styles.description__title}>Описание</h2>
      <p className={styles.description__text}>{assignment.description}</p>

      {(assignment.fileLink || assignment.testing?.fileLink) && (
        <div className={styles.description__materials}>
          <h2 className={styles.description__title}>Материалы</h2>

          {assignment.fileLink && (
            <a
              href={`http://localhost:3000${assignment.fileLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.description__fileLink}
              aria-label="Учебные материалы"
            >
              Учебные материалы
            </a>
          )}

          {assignment.testing?.fileLink && (
            <a
              href={`http://localhost:3000${assignment.testing.fileLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.description__fileLink}
              aria-label="Материалы тестирования"
            >
              Материалы тестирования
            </a>
          )}
        </div>
      )}
    </section>
  );
};
