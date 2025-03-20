import React from "react";
import { Link } from "react-router-dom";
import {
  FileTextOutlined,
  CheckSquareOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { ApiAssignment } from "../../../types";
import { formatDate, formatDateTime } from "../../../utils/dateUtils";
import styles from "./AssignmentItem.module.scss";

interface AssignmentItemProps {
  assignment: ApiAssignment;
  isTest: boolean;
}

export const AssignmentItem: React.FC<AssignmentItemProps> = React.memo(
  ({ assignment, isTest }) => (
    <div className={styles.assignment}>
      <div
        className={`${styles.assignment__icon} ${
          isTest ? styles.assignment__iconTest : ""
        }`}
      >
        {isTest ? <CheckSquareOutlined /> : <FileTextOutlined />}
      </div>
      <div className={styles.assignment__content}>
        <h3 className={styles.assignment__title}>{assignment.title}</h3>
        <p className={styles.assignment__description}>
          {assignment.description}
        </p>
        <div className={styles.assignment__details}>
          <span className={styles.assignment__deadline}>
            <ClockCircleOutlined /> {isTest ? "Доступно до: " : "Срок сдачи: "}
            {formatDate(isTest ? assignment.closeTime : assignment.deadline)}
          </span>
          <span className={styles.assignment__teacher}>
            <UserOutlined /> {assignment.employee.lastName}{" "}
            {assignment.employee.firstName.charAt(0)}.
            {assignment.employee.middleName?.charAt(0)}.
          </span>
          {isTest && assignment.testing && (
            <span className={styles.assignment__attempts}>
              Попыток: {assignment.testing.attemptsCount}
            </span>
          )}
        </div>
        <div className={styles.assignment__timeRange}>
          <CalendarOutlined /> Период выполнения:{" "}
          {formatDateTime(assignment.openTime)} -{" "}
          {formatDateTime(assignment.closeTime)}
        </div>
      </div>
      <Link
        to={`/assignment/${assignment.idAssignment}`}
        className={styles.assignment__action}
        title="Перейти к заданию"
      >
        {isTest ? "Пройти тест" : "Открыть"}
      </Link>
    </div>
  )
);
