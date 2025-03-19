import React from "react";
import styles from "./StudentSelection.module.scss";
import { StudentSelectionProps } from "../../../types";
import { Avatar } from "antd";

export const StudentSelection: React.FC<StudentSelectionProps> = ({
  children,
  onStudentSelect,
}) => {
  return (
    <section className={styles.studentSelection}>
      <h1 className={styles.studentSelection__title}>Выберите ученика</h1>
      <div className={styles.studentSelection__list}>
        {children.map((child) => (
          <article
            key={child.student.idStudent}
            className={styles.studentSelection__card}
            onClick={() => onStudentSelect(child.student.idStudent)}
          >
            <div className={styles.studentSelection__avatarWrapper}>
              {child.student.photo ? (
                <Avatar 
                  src={child.student.photo} 
                  size={48}
                  className={styles.studentSelection__avatar}
                />
              ) : (
                <Avatar 
                  size={48}
                  className={styles.studentSelection__avatar}
                >
                  {child.student.firstName[0]}{child.student.lastName[0]}
                </Avatar>
              )}
            </div>
            <div className={styles.studentSelection__info}>
              <div className={styles.studentSelection__name}>
                {child.student.lastName} {child.student.firstName}{" "}
                {child.student.middleName}
              </div>
              <div className={styles.studentSelection__class}>
                Класс: {child.class.classNumber}
                {child.class.classLetter}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
