import React from "react";
import styles from "./ScheduleLesson.module.scss";
import { ScheduleLessonProps } from "../../../types";

export const ScheduleLesson: React.FC<ScheduleLessonProps> = ({
  lesson,
  onLessonClick,
  formatTime,
}) => {
  return (
    <article
      className={styles.scheduleLesson}
      onClick={() => onLessonClick(lesson.subject.idSubject)}
    >
      <div className={styles.scheduleLesson__time}>
        {formatTime(lesson.startTime)} - {formatTime(lesson.endTime)}
      </div>
      <div className={styles.scheduleLesson__name}>
        {lesson.subject.subjectName}
      </div>
      <div className={styles.scheduleLesson__details}>
        <div className={styles.scheduleLesson__teacher}>
          {lesson.employee.lastName}{" "}
          {lesson.employee.firstName.charAt(0)}.
          {lesson.employee.middleName.charAt(0)}.
        </div>
        <div className={styles.scheduleLesson__room}>
          Кабинет: {lesson.roomNumber}
        </div>
      </div>
    </article>
  );
};
