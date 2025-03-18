import React from "react";
import styles from "./ScheduleDay.module.scss";
import { ScheduleDayProps } from "../../../types";
import { ScheduleLesson } from "../ScheduleLesson/ScheduleLesson";


export const ScheduleDay: React.FC<ScheduleDayProps> = ({
  date,
  dayName,
  lessons,
  onLessonClick,
  formatTime,
  isToday,
}) => {
  return (
    <article className={`${styles.scheduleDay} ${isToday ? styles.scheduleDay_today : ''}`}>
      <header className={styles.scheduleDay__header}>
        <h2 className={styles.scheduleDay__name}>
          {dayName}
          {isToday && <span className={styles.scheduleDay__todayBadge}>Сегодня</span>}
        </h2>
        <p className={styles.scheduleDay__date}>
          {new Date(date).toLocaleDateString("ru-RU")}
        </p>
      </header>

      {lessons && lessons.length > 0 ? (
        <section className={styles.scheduleDay__lessons}>
          {lessons.map((lesson) => (
            <ScheduleLesson
              key={lesson.idSchedule}
              lesson={lesson}
              onLessonClick={onLessonClick}
              formatTime={formatTime}
            />
          ))}
        </section>
      ) : (
        <div className={styles.scheduleDay__noLessons}>Нет уроков</div>
      )}
    </article>
  );
};
