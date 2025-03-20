import React from "react";
import { Subject } from "../../../types";
import styles from "./SubjectHeader.module.scss";

interface SubjectHeaderProps {
  subject: Subject;
  color: string;
  icon: string;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({ subject, color, icon }) => {
  return (
    <div
      className={styles.subjectHeader}
      style={{
        backgroundColor: `${color}15`,
        borderColor: color,
      }}
    >
      <div className={styles.subjectHeader__icon}>{icon}</div>
      <div className={styles.subjectHeader__info}>
        <h1 className={styles.subjectHeader__title}>{subject.name}</h1>
        <p className={styles.subjectHeader__description}>{subject.description}</p>
      </div>
    </div>
  );
};
