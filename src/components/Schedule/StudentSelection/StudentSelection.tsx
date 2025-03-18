import React from "react";
import styles from "./StudentSelection.module.scss";
import { StudentSelectionProps } from "../../../types";

export const StudentSelection: React.FC<StudentSelectionProps> = ({
  children,
  onStudentSelect,
}) => {
  return (
    <section className={styles.studentSelection}>
      <h1 className={styles.studentSelection__title}>Выберите ученика</h1>
      <div className={styles.studentSelection__list}>
        {children.map((child) => (
          <div
            key={child.student.idStudent}
            className={styles.studentSelection__card}
            onClick={() => onStudentSelect(child.student.idStudent)}
          >
            <div className={styles.studentSelection__name}>
              {child.student.lastName} {child.student.firstName}{" "}
              {child.student.middleName}
            </div>
            <div className={styles.studentSelection__class}>
              Класс: {child.class.classNumber}
              {child.class.classLetter}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
