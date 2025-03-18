import React from "react";
import styles from "./ScheduleHeader.module.scss";
import { ScheduleHeaderProps } from "../../../types";

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  title,
  dateRange,
  onPreviousWeek,
  onCurrentWeek,
  onNextWeek,
}) => {
  return (
    <header className={styles.scheduleHeader}>
      <h1 className={styles.scheduleHeader__title}>{title}</h1>

      <div className={styles.scheduleHeader__content}>
        <div className={styles.scheduleHeader__dateContainer}>
          <span className={styles.scheduleHeader__dateLabel}>Период:</span>
          <div className={styles.scheduleHeader__dateRange}>{dateRange}</div>
        </div>

        <div className={styles.scheduleHeader__navigation}>
          <button
            className={styles.scheduleHeader__navigationButton}
            onClick={onPreviousWeek}
          >
            <span className={styles.scheduleHeader__navigationIcon}>&#8592;</span>
            Предыдущая
          </button>
          <button
            className={`${styles.scheduleHeader__navigationButton} ${styles.scheduleHeader__navigationButtonCurrent}`}
            onClick={onCurrentWeek}
          >
            Текущая
          </button>
          <button
            className={styles.scheduleHeader__navigationButton}
            onClick={onNextWeek}
          >
            Следующая
            <span className={styles.scheduleHeader__navigationIcon}>&#8594;</span>
          </button>
        </div>
      </div>
    </header>
  );
};
