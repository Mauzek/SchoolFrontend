import React from "react";
import styles from "./ScheduleContent.module.scss";
import { ScheduleDay } from "../ScheduleDay/ScheduleDay";
import { ScheduleContentProps } from "../../../types";


export const ScheduleContent: React.FC<ScheduleContentProps> = ({
  weekDates,
  scheduleData,
  onLessonClick,
  formatTime,
  getDayName,
  isToday,
}) => {
  return (
    <section className={styles.scheduleContent}>
      {weekDates.map((date) => (
        <ScheduleDay
          key={date}
          date={date}
          dayName={getDayName(date)}
          lessons={scheduleData[date] || []}
          onLessonClick={onLessonClick}
          formatTime={formatTime}
          isToday={isToday(date)}
        />
      ))}
    </section>
  );
};
