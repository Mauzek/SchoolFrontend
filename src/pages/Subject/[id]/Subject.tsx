import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BookOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  DownloadOutlined,
  ClockCircleOutlined,
  UserOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import styles from "./Subject.module.scss";
import { RootState } from "../../../store";
import {
  getSubjectById,
  getAssignmentsBySubjectIdAndClassId,
  getTextbooksBySubjectId,
} from "../../../api/api-utils";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { formatDate, formatDateTime } from "../../../utils/dateUtils";
import {
  ApiTextbook,
  ApiAssignment,
  Subject as ApiSubject,
} from "../../../types";

export const Subject = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const [subject, setSubject] = useState<ApiSubject | null>(null);
  const [textbooks, setTextbooks] = useState<ApiTextbook[]>([]);
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"textbooks" | "assignments">(
    "textbooks"
  );

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Получаем информацию о предмете
        const subjectResponse = await getSubjectById(
          parseInt(id),
          user.accessToken
        );
        if (subjectResponse && subjectResponse.subject) {
          setSubject(subjectResponse.subject);
        }

        // Получаем учебники по предмету
        const textbooksResponse = await getTextbooksBySubjectId(
          parseInt(id),
          user.accessToken
        );
        if (textbooksResponse && textbooksResponse.textbooks) {
          setTextbooks(textbooksResponse.textbooks);
        }

        // Получаем задания по предмету и классу
        if (user.user.additionalInfo.idClass || location.state?.idClass) {
          const classId = user.user.additionalInfo.idClass || location.state?.idClass;
          const assignmentsResponse = await getAssignmentsBySubjectIdAndClassId(
            parseInt(id),
            classId,
            user.accessToken
          );
          console.log(assignmentsResponse);
          if (assignmentsResponse && assignmentsResponse.data) {
            setAssignments(assignmentsResponse.data);
          }
        }
      } catch (error) {
        console.error("Ошибка при загрузке данных предмета:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectData();
  }, [id, user.accessToken, user.user.additionalInfo.idClass]);

  // Функция для получения цвета предмета
  const getSubjectColor = (subjectId: number) => {
    const colors = [
      "var(--color-primary)",
      "#FFC107",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#3f51b5",
      "#e91e63",
      "#009688",
    ];

    return colors[subjectId % colors.length];
  };

  // Функция для получения иконки предмета
  const getSubjectIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("math") || lowerName.includes("матем")) {
      return "📊";
    } else if (lowerName.includes("history") || lowerName.includes("истор")) {
      return "🏛️";
    } else if (lowerName.includes("physics") || lowerName.includes("физик")) {
      return "⚛️";
    } else if (lowerName.includes("chemistry") || lowerName.includes("хими")) {
      return "🧪";
    } else if (lowerName.includes("biology") || lowerName.includes("биолог")) {
      return "🧬";
    } else if (
      lowerName.includes("literature") ||
      lowerName.includes("литерат")
    ) {
      return "📚";
    } else if (
      lowerName.includes("geography") ||
      lowerName.includes("географ")
    ) {
      return "🌍";
    }

    return "📖";
  };

  if (loading) {
    return (
      <div className={styles.subjects}>
        <div className={styles.subjects__spinner} />
        <p className={styles.subjects__text}>Загрузка...</p>
      </div>
    );
  }

  if (!subject) {
    return <EmptyState message="Предмет не найден" />;
  }

  const subjectColor = getSubjectColor(subject.idSubject);
  const subjectIcon = getSubjectIcon(subject.name);

  // Проверка, является ли задание тестовым
  const isTestAssignment = (assignment: ApiAssignment) => {
    return !!assignment.testing;
  };

  return (
    <div className={styles.subject}>
      <div
        className={styles.subject__header}
        style={{
          backgroundColor: `${subjectColor}15`,
          borderColor: subjectColor,
        }}
      >
        <div className={styles.subject__icon}>{subjectIcon}</div>
        <div className={styles.subject__info}>
          <h1 className={styles.subject__title}>{subject.name}</h1>
          <p className={styles.subject__description}>{subject.description}</p>
        </div>
      </div>

      <div className={styles.subject__tabs}>
        <button
          className={`${styles.subject__tab} ${
            activeTab === "textbooks" ? styles.subject__tabActive : ""
          }`}
          onClick={() => setActiveTab("textbooks")}
        >
          <BookOutlined /> Учебники
        </button>
        <button
          className={`${styles.subject__tab} ${
            activeTab === "assignments" ? styles.subject__tabActive : ""
          }`}
          onClick={() => setActiveTab("assignments")}
        >
          <FileTextOutlined /> Задания
        </button>
      </div>

      <div className={styles.subject__content}>
        {activeTab === "textbooks" && (
          <div className={styles.subject__textbooks}>
            <h2 className={styles.subject__sectionTitle}>
              Учебники по предмету {}
            </h2>

            {textbooks.length > 0 ? (
              <div className={styles.subject__textbooksList}>
                {textbooks.map((textbook) => (
                  <div key={textbook.idTextbook} className={styles.textbook}>
                    <div className={styles.textbook__icon}>
                      <BookOutlined />
                    </div>
                    <div className={styles.textbook__content}>
                      <h3 className={styles.textbook__title}>
                        {textbook.name}
                      </h3>
                      <p className={styles.textbook__authors}>
                        {textbook.authors}
                      </p>
                      <div className={styles.textbook__details}>
                        <span className={styles.textbook__year}>
                          Год издания: {textbook.year}
                        </span>
                        {textbook.isbn && (
                          <span className={styles.textbook__isbn}>
                            ISBN: {textbook.isbn}
                          </span>
                        )}
                      </div>
                    </div>
                    {textbook.fileLink && (
                      <a
                        href={textbook.fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.textbook__download}
                        title="Скачать учебник"
                      >
                        <DownloadOutlined />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="Учебники по данному предмету не найдены" />
            )}
          </div>
        )}

        {activeTab === "assignments" && (
          <div className={styles.subject__assignments}>
            <h2 className={styles.subject__sectionTitle}>
              Задания по предмету
            </h2>

            {assignments.length > 0 ? (
              <>
                {/* Тестовые задания */}
                {assignments.some(isTestAssignment) && (
                  <div className={styles.subject__assignmentsSection}>
                    <h3 className={styles.subject__assignmentsSectionTitle}>
                      <CheckSquareOutlined /> Тестовые задания
                    </h3>
                    <div className={styles.subject__assignmentsList}>
                      {assignments
                        .filter(isTestAssignment)
                        .map((assignment) => (
                          <div
                            key={assignment.idAssignment}
                            className={styles.assignment}
                          >
                            <div
                              className={`${styles.assignment__icon} ${styles.assignment__iconTest}`}
                            >
                              <CheckSquareOutlined />
                            </div>
                            <div className={styles.assignment__content}>
                              <h3 className={styles.assignment__title}>
                                {assignment.title}
                              </h3>
                              <p className={styles.assignment__description}>
                                {assignment.description}
                              </p>
                              <div className={styles.assignment__details}>
                                <span className={styles.assignment__deadline}>
                                  <ClockCircleOutlined /> Доступно до:{" "}
                                  {formatDate(assignment.closeTime)}
                                </span>
                                <span className={styles.assignment__teacher}>
                                  <UserOutlined />{" "}
                                  {assignment.employee.lastName}{" "}
                                  {assignment.employee.firstName.charAt(0)}.
                                  {assignment.employee.middleName?.charAt(0)}.
                                </span>
                                {assignment.testing && (
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
                              Пройти тест
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* Обычные задания */}
                {assignments.some((a) => !isTestAssignment(a)) && (
                  <div className={styles.subject__assignmentsSection}>
                    <h3 className={styles.subject__assignmentsSectionTitle}>
                      <FileTextOutlined /> Обычные задания
                    </h3>
                    <div className={styles.subject__assignmentsList}>
                      {assignments
                        .filter((a) => !isTestAssignment(a))
                        .map((assignment) => (
                          <div
                            key={assignment.idAssignment}
                            className={styles.assignment}
                          >
                            <div className={styles.assignment__icon}>
                              <FileTextOutlined />
                            </div>
                            <div className={styles.assignment__content}>
                              <h3 className={styles.assignment__title}>
                                {assignment.title}
                              </h3>
                              <p className={styles.assignment__description}>
                                {assignment.description}
                              </p>
                              <div className={styles.assignment__details}>
                                <span className={styles.assignment__deadline}>
                                  <ClockCircleOutlined /> Срок сдачи:{" "}
                                  {formatDate(assignment.deadline)}
                                </span>
                                <span className={styles.assignment__teacher}>
                                  <UserOutlined />{" "}
                                  {assignment.employee.lastName}{" "}
                                  {assignment.employee.firstName.charAt(0)}.
                                  {assignment.employee.middleName?.charAt(0)}.
                                </span>
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
                              Открыть
                            </Link>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <EmptyState message="Задания по данному предмету не найдены" />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
