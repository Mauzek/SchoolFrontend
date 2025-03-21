import React from "react";
import { Link } from "react-router-dom";
import {
  PlusOutlined,
  CheckSquareOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { ApiAssignment, ApiAllClassesResponse } from "../../../types";
import { EmptyState } from "../../../components";
import { AssignmentItem } from "../AssignmentItem/AssignmentItem";
import { ClassSelector } from "../ClassSelector/ClassSelector";
import styles from "./AssignmentsSection.module.scss";

interface AssignmentsSectionProps {
  assignments: ApiAssignment[];
  testAssignments: ApiAssignment[];
  regularAssignments: ApiAssignment[];
  subjectId: string;
  isAdminOrTeacher: boolean;
  selectedClass: number | null;
  selectedClassName: string;
  classes: ApiAllClassesResponse["classes"];
  onClassSelect: (classId: number) => void;
  loadingAssignments: boolean;
}

export const AssignmentsSection: React.FC<AssignmentsSectionProps> = ({
  assignments,
  testAssignments,
  regularAssignments,
  subjectId,
  isAdminOrTeacher,
  selectedClass,
  selectedClassName,
  classes,
  onClassSelect,
  loadingAssignments,
}) => {
  
  return (
    <div className={styles.assignmentsSection}>
      <div className={styles.assignmentsSection__header}>
        <h2 className={styles.assignmentsSection__title}>
          Задания по предмету
          {isAdminOrTeacher && selectedClassName && (
            <span className={styles.assignmentsSection__selectedClass}>
              {selectedClassName}
            </span>
          )}
        </h2>

        <div className={styles.assignmentsSection__headerActions}>
          {isAdminOrTeacher && selectedClass && (
            <Link
              to={`/subject/${subjectId}/create-assignment?classId=${selectedClass}`}
              state={{ idClass: selectedClass, idSubject: parseInt(subjectId) }}
              className={styles.assignmentsSection__addButton}
            >
              <PlusOutlined /> Создать задание
            </Link>
          )}

          {isAdminOrTeacher && (
            <ClassSelector
              classes={classes}
              selectedClass={selectedClass}
              selectedClassName={selectedClassName}
              onClassSelect={onClassSelect}
            />
          )}
        </div>
      </div>

      {loadingAssignments ? (
        <div className={styles.assignmentsSection__loading}>
          <div className={styles.assignmentsSection__spinner} />
          <p>Загрузка заданий...</p>
        </div>
      ) : assignments.length > 0 ? (
        <>
          {/* Тестовые задания */}
          {testAssignments.length > 0 && (
            <div className={styles.assignmentsSection__group}>
              <h3 className={styles.assignmentsSection__groupTitle}>
                <CheckSquareOutlined /> Тестовые задания
              </h3>
              <div className={styles.assignmentsSection__list}>
                {testAssignments.map((assignment) => (
                  <AssignmentItem
                    key={assignment.idAssignment}
                    assignment={assignment}
                    isTest={true}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Обычные задания */}
          {regularAssignments.length > 0 && (
            <div className={styles.assignmentsSection__group}>
              <h3 className={styles.assignmentsSection__groupTitle}>
                <FileTextOutlined /> Обычные задания
              </h3>
              <div className={styles.assignmentsSection__list}>
                {regularAssignments.map((assignment) => (
                  <AssignmentItem
                    key={assignment.idAssignment}
                    assignment={assignment}
                    isTest={false}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          message={
            selectedClass
              ? "Задания по данному предмету для выбранного класса не найдены"
              : "Выберите класс для просмотра заданий"
          }
        />
      )}
    </div>
  );
};
