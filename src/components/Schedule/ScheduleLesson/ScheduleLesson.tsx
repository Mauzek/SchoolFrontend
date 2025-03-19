import React from "react";
import { useSelector } from "react-redux";
import styles from "./ScheduleLesson.module.scss";
import { ScheduleLessonProps } from "../../../types";
import { RootState } from "../../../store";

export const ScheduleLesson: React.FC<ScheduleLessonProps> = ({
  lesson,
  onLessonClick,
  formatTime,
}) => {
  // Получаем информацию о пользователе из Redux store
  const user = useSelector((state: RootState) => state.user.user);
  
  // Проверяем, имеет ли пользователь роль 3
  const isNoStudent = user.role.id === 3;

  return (
    <article
      className={styles.scheduleLesson}
      onClick={() => onLessonClick(lesson.subject.idSubject, lesson.class.idClass)}
    >
      <div className={styles.scheduleLesson__time}>
        {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
        {!isNoStudent && (
          <span className={styles.scheduleLesson__class}>
            {lesson.class.classNumber}{lesson.class.classLetter}
          </span>
        )}
      </div>
      <div className={styles.scheduleLesson__name}>
        {lesson.subject.subjectName}
      </div>
      <div className={styles.scheduleLesson__details}>
        <div className={styles.scheduleLesson__teacher}>
          {lesson.employee.lastName}{" "}
          {lesson.employee.firstName.charAt(0)}.
          {lesson.employee.middleName && lesson.employee.middleName.charAt(0)}.
        </div>
        <div className={styles.scheduleLesson__room}>
          Кабинет: {lesson.roomNumber}
        </div>
      </div>
    </article>
  );
};
