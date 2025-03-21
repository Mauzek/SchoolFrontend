import React from "react";
import { Link } from "react-router-dom";
import styles from "./TeacherAnswersList.module.scss";
import { StudentAssignmentAnswer } from "../../../types";

interface TeacherAnswersListProps {
  answers: StudentAssignmentAnswer[];
  onViewAnswer: (answer: StudentAssignmentAnswer) => void;
}

export const TeacherAnswersList: React.FC<TeacherAnswersListProps> = ({
  answers,
  onViewAnswer,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("ru-RU", options);
  };

  return (
    <section className={styles.answers}>
      <h2 className={styles.answers__title}>Ответы студентов</h2>

      {answers.length > 0 ? (
        <div className={styles.answers__container}>
          <table className={styles.answers__table}>
            <thead>
              <tr>
                <th>Студент</th>
                <th>Дата отправки</th>
                <th>Статус</th>
                <th>Оценка</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((answer) => (
                <tr key={answer.idAnswer} className={styles.answers__row}>
                  <td>
                    <Link
                      to={`/profile/${answer.student?.idStudent}`}
                      state={{ role: 3 }}
                      className={styles.answers__studentLink}
                    >
                      {answer.student?.firstName} {answer.student?.lastName}
                    </Link>
                  </td>
                  <td>{formatDate(answer.submissionDate)}</td>
                  <td>
                    <span
                      className={`${styles.answers__statusBadge} ${
                        answer.grade !== null
                          ? styles["answers__statusBadge--submitted"]
                          : styles["answers__statusBadge--pending"]
                      }`}
                    >
                      {answer.grade !== null ? "Оценено" : "Ожидает оценки"}
                    </span>
                  </td>
                  <td className={styles.answers__gradeCell}>
                    {answer.grade !== null ? answer.grade : "—"}
                  </td>
                  <td>
                    <button
                      className={styles.answers__viewButton}
                      onClick={() => onViewAnswer(answer)}
                      aria-label={`Просмотреть ответ студента ${answer.student?.firstName} ${answer.student?.lastName}`}
                    >
                      <span className={styles.answers__viewButtonIcon}>👁️</span>
                      <span>Просмотреть</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.answers__noAnswers}>
          <div className={styles.answers__noAnswersIcon}>📭</div>
          <p>Пока нет ответов на это задание.</p>
        </div>
      )}
    </section>
  );
};
