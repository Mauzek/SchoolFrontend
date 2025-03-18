import React from "react";
import styles from "./ScheduleControls.module.scss";
import { ScheduleControlsProps } from "../../../types";

export const ScheduleControls: React.FC<ScheduleControlsProps> = ({
  isParent,
  isAdmin,
  selectedStudentId,
  onBackToStudentSelection,
  onNavigateToCreateSchedule,
}) => {
  return (
    <nav className={styles.scheduleControls}>
      {isParent && selectedStudentId && (
        <button
          className={styles.scheduleControls__backButton}
          onClick={onBackToStudentSelection}
        >
          ← Назад к выбору ученика
        </button>
      )}

      {isAdmin && (
        <button
          className={styles.scheduleControls__adminButton}
          onClick={onNavigateToCreateSchedule}
        >
          Создать расписание
        </button>
      )}
    </nav>
  );
};
