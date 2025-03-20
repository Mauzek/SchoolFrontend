import React, { useEffect, useState, useRef, FormEvent } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./Assignment.module.scss";
import {
  getAssignmentById,
  getStudentAssignmentAnswer,
  getStudentTestingAnswer,
  createAssignmentAnswer,
  getAllAssignmentAnswersByAssignmentID,
  updateAssignmentAnswer,
} from "../../api/api-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ApiAssignment, StudentAssignmentAnswer } from "../../types";
import { SubjectHeader } from "../../components/Subjects";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export const Assignment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user);
  const [assignment, setAssignment] = useState<ApiAssignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assignmentAnswer, setAssignmentAnswer] =
    useState<StudentAssignmentAnswer | null>(null);
  const [allAnswers, setAllAnswers] = useState<StudentAssignmentAnswer[]>([]);
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] =
    useState<StudentAssignmentAnswer | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [gradeValue, setGradeValue] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("");
  const [submittingGrade, setSubmittingGrade] = useState<boolean>(false);

  // Check if user is teacher or admin
  const isTeacherOrAdmin = user.user.role?.id === 1 || user.user.role?.id === 2;

  // Create the default layout plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!id) return;

        const assignmentData = await getAssignmentById(
          parseInt(id),
          user.accessToken
        );
        setAssignment(assignmentData.data);

        // For teachers and admins, fetch all answers
        if (isTeacherOrAdmin) {
          const allAnswersData = await getAllAssignmentAnswersByAssignmentID(
            parseInt(id),
            user.accessToken
          );
          setAllAnswers(allAnswersData.data);
        }
        // For students, fetch their own answer
        else if (
          user.user.additionalInfo.idStudent &&
          assignmentData.data.idAssignment &&
          assignmentData.data.testing == null
        ) {
          const answer = await getStudentAssignmentAnswer(
            user.user.additionalInfo.idStudent,
            assignmentData.data.idAssignment,
            user.accessToken
          );
          setAssignmentAnswer(answer.data);
        }
        // For testing assignments
        else if (
          user.user.additionalInfo.idStudent &&
          assignmentData.data.testing
        ) {
          const answer = await getStudentTestingAnswer(
            user.user.additionalInfo.idStudent,
            assignmentData.data.testing.idTesting,
            user.accessToken
          );
          setAssignmentAnswer(answer.data);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Не удалось загрузить задание. Пожалуйста, попробуйте позже.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    id,
    user.accessToken,
    user.user.additionalInfo.idStudent,
    isTeacherOrAdmin,
  ]);

  // Update the modal when it opens to set initial values
  useEffect(() => {
    if (selectedAnswer) {
      setGradeValue(
        selectedAnswer.grade != null ? selectedAnswer.grade.toString() : ""
      );
      setFeedback(""); // Reset feedback when opening a new answer
    }
  }, [selectedAnswer]);

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node) &&
        showAnswerModal
      ) {
        closeAnswerModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showAnswerModal]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (showAnswerModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAnswerModal]);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Пожалуйста, загрузите PDF файл.");
      return;
    }

    setSubmitting(true);

    try {
      if (assignment && user.user.additionalInfo.idStudent) {
        const currentDate = new Date().toISOString();

        const formData = new FormData();
        formData.append("file", file);
        formData.append("textAnswer", textAnswer);
        formData.append("submissionDate", currentDate);
        formData.append(
          "idStudent",
          user.user.additionalInfo.idStudent.toString()
        );
        formData.append("idAssignment", assignment.idAssignment.toString());

        await createAssignmentAnswer(formData, user.accessToken);

        alert("Ответ успешно отправлен!");

        const assignmentData = await getAssignmentById(
          parseInt(id!),
          user.accessToken
        );
        setAssignment(assignmentData.data);

        if (
          user.user.additionalInfo.idStudent &&
          assignmentData.data.idAssignment
        ) {
          const answer = await getStudentAssignmentAnswer(
            user.user.additionalInfo.idStudent,
            assignmentData.data.idAssignment,
            user.accessToken
          );
          setAssignmentAnswer(answer.data);
        }

        setTextAnswer("");
        setFile(null);
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      alert("Ошибка при отправке ответа. Пожалуйста, попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGradeSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedAnswer || !gradeValue) {
      return;
    }

    setSubmittingGrade(true);

    try {
      await updateAssignmentAnswer(
        parseInt(gradeValue),
        selectedAnswer.idAnswer,
        user.accessToken
      );

      // Refresh the answers list
      if (id) {
        const allAnswersData = await getAllAssignmentAnswersByAssignmentID(
          parseInt(id),
          user.accessToken
        );
        setAllAnswers(allAnswersData.data);

        // Update the selected answer with the new grade
        const updatedAnswer = allAnswersData.data.find(
          (answer) => answer.idAnswer === selectedAnswer.idAnswer
        );

        if (updatedAnswer) {
          setSelectedAnswer(updatedAnswer);
        }
      }

      alert("Оценка успешно сохранена!");
    } catch (err) {
      console.error("Error saving grade:", err);
      alert("Ошибка при сохранении оценки. Пожалуйста, попробуйте снова.");
    } finally {
      setSubmittingGrade(false);
    }
  };

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

  const handleViewAnswer = (answer: StudentAssignmentAnswer) => {
    setSelectedAnswer(answer);
    setShowAnswerModal(true);
  };

  const closeAnswerModal = () => {
    setShowAnswerModal(false);
    setTimeout(() => {
      setSelectedAnswer(null);
    }, 300); // Wait for animation to complete
  };

  if (loading) {
    return (
      <div className={styles.assignment__loading}>
        <div className={styles["assignment__loading-spinner"]}></div>
        <p>Загрузка задания...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.assignment__error}>
        <h2>Ошибка</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className={styles.assignment__error}>
        <h2>Задание не найдено</h2>
        <p>Запрашиваемое задание не существует или у вас нет к нему доступа.</p>
      </div>
    );
  }

  const hasAnswer = assignmentAnswer !== null;
  const isOverdue = new Date(assignment.closeTime) < new Date();

  return (
    <main className={styles.assignment}>
      <SubjectHeader icon="📝" color="#FFC107" subject={assignment.subject} />

      <article className={styles.assignment__card}>
        <header className={styles.assignment__header}>
          <h1 className={styles.assignment__title}>{assignment.title}</h1>
          <div className={styles.assignment__dates}>
            <div className={styles.assignment__date}>
              <span className={styles["assignment__date-label"]}>
                Открыто:{" "}
              </span>
              <span className={styles["assignment__date-value"]}>
                {formatDate(assignment.openTime)}
              </span>
            </div>
            <div className={styles.assignment__date}>
              <span className={styles["assignment__date-label"]}>
                Закрывается:{" "}
              </span>
              <span className={styles["assignment__date-value"]}>
                {formatDate(assignment.closeTime)}
              </span>
            </div>
            <div className={styles.assignment__status}>
              <span
                className={`${styles["assignment__status-badge"]} ${
                  isOverdue
                    ? styles["assignment__status-badge--closed"]
                    : styles["assignment__status-badge--open"]
                }`}
              >
                {isOverdue ? "Закрыто" : "Открыто"}
              </span>
            </div>
          </div>
        </header>

        <section className={styles.assignment__section}>
          <h2 className={styles["assignment__section-title"]}>Описание</h2>
          <p className={styles.assignment__description}>
            {assignment.description}
          </p>
        </section>

        {assignment.fileLink && (
          <section className={styles.assignment__section}>
            <h2 className={styles["assignment__section-title"]}>Материалы</h2>
            <a
              href={assignment.fileLink}
              target="_blank"
              rel="noopener noreferrer"
              className={styles["assignment__file-link"]}
              aria-label="Скачать материалы задания"
            >
              Скачать материалы
            </a>
          </section>
        )}

        {/* Teacher/Admin view - List of all answers */}
        {isTeacherOrAdmin && (
          <section className={styles.assignment__section}>
            <h2 className={styles["assignment__section-title"]}>
              Ответы студентов
            </h2>
            {allAnswers.length > 0 ? (
              <div className={styles.assignment__answersContainer}>
                <table className={styles.assignment__answersTable}>
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
                    {allAnswers.map((answer) => (
                      <tr
                        key={answer.idAnswer}
                        className={styles.assignment__answersRow}
                      >
                        <td>
                          <Link
                            to={`/profile/${answer.student?.idStudent}`}
                            className={styles.assignment__studentLink}
                          >
                            {answer.student?.firstName}{" "}
                            {answer.student?.lastName}
                          </Link>
                        </td>
                        <td>{formatDate(answer.submissionDate)}</td>
                        <td>
                          <span
                            className={`${styles["assignment__status-badge"]} ${
                              answer.grade != null
                                ? styles["assignment__status-badge--submitted"]
                                : styles["assignment__status-badge--pending"]
                            }`}
                          >
                            {answer.grade != null
                              ? "Оценено"
                              : "Ожидает оценки"}
                          </span>
                        </td>
                        <td className={styles.assignment__gradeCell}>
                          {answer.grade != null ? answer.grade : "—"}
                        </td>
                        <td>
                          <button
                            className={styles.assignment__viewButton}
                            onClick={() => handleViewAnswer(answer)}
                            aria-label={`Просмотреть ответ студента ${answer.student?.firstName} ${answer.student?.lastName}`}
                          >
                            <span className={styles.assignment__viewButtonIcon}>
                              👁️
                            </span>
                            <span>Просмотреть</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={styles.assignment__noAnswers}>
                <div className={styles.assignment__noAnswersIcon}>📭</div>
                <p>Пока нет ответов на это задание.</p>
              </div>
            )}
          </section>
        )}

        {/* Student view - Their own answer or submission form */}
        {!isTeacherOrAdmin && (
          <>
            {hasAnswer ? (
              <section className={styles.assignment__section}>
                <h2 className={styles["assignment__section-title"]}>
                  Ваш ответ
                </h2>
                <div className={styles.assignment__answer}>
                  {assignmentAnswer?.fileLink && (
                    <div className={styles.assignment__pdfWrapper}>
                      <h3 className={styles.assignment__answerSubtitle}>
                        Загруженный файл:
                      </h3>
                      <div className={styles.assignment__pdfContainer}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                          <Viewer
                            fileUrl={assignmentAnswer.fileLink}
                            plugins={[defaultLayoutPluginInstance]}
                          />
                        </Worker>
                      </div>
                    </div>
                  )}

                  <div className={styles.assignment__answerDetails}>
                    {assignmentAnswer?.textAnswer && (
                      <div className={styles.assignment__answerText}>
                        <h3 className={styles.assignment__answerSubtitle}>
                          Текстовый ответ:
                        </h3>
                        <div className={styles.assignment__answerTextContent}>
                          {assignmentAnswer.textAnswer}
                        </div>
                      </div>
                    )}

                    <div className={styles.assignment__grade}>
                      <h3 className={styles.assignment__answerSubtitle}>
                        Оценка:
                      </h3>
                      <div
                        className={`${styles.assignment__gradeValue} ${
                          assignmentAnswer && assignmentAnswer.grade != null
                            ? styles.assignment__gradeValue_set
                            : styles.assignment__gradeValue_none
                        }`}
                      >
                        {assignmentAnswer && assignmentAnswer.grade != null
                          ? assignmentAnswer.grade
                          : "Пока ещё не оценено"}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ) : !isOverdue ? (
              <section className={styles.assignment__section}>
                <h2 className={styles["assignment__section-title"]}>
                  Отправить ответ
                </h2>
                <form
                  onSubmit={handleSubmitAnswer}
                  className={styles.assignment__form}
                >
                  <div className={styles["assignment__form-group"]}>
                    <label htmlFor="file">Загрузить PDF файл:</label>
                    <input
                      type="file"
                      id="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        setFile(e.target.files ? e.target.files[0] : null)
                      }
                      className={styles.assignment__input}
                      aria-required="true"
                    />
                    {file && (
                      <div className={styles.assignment__fileSelected}>
                        <span className={styles.assignment__fileIcon}>📄</span>
                        <span>Выбран файл: {file.name}</span>
                      </div>
                    )}
                  </div>

                  <div className={styles["assignment__form-group"]}>
                    <label htmlFor="textAnswer">
                      Текстовый ответ (необязательно):
                    </label>
                    <textarea
                      id="textAnswer"
                      value={textAnswer}
                      onChange={(e) => setTextAnswer(e.target.value)}
                      className={styles.assignment__textarea}
                      rows={5}
                      placeholder="Введите ваш ответ здесь..."
                      aria-required="false"
                    />
                  </div>

                  <button
                    type="submit"
                    className={styles.assignment__button}
                    disabled={submitting || !file}
                    aria-busy={submitting}
                  >
                    {submitting ? (
                      <>
                        <span
                          className={styles.assignment__buttonSpinner}
                        ></span>
                        <span>Отправка...</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.assignment__buttonIcon}>
                          📤
                        </span>
                        <span>Отправить ответ</span>
                      </>
                    )}
                  </button>
                </form>
              </section>
            ) : (
              <section className={styles.assignment__section}>
                <div className={styles.assignment__noAnswerMessage}>
                  <div className={styles.assignment__noAnswerIcon}>❌</div>
                  <h3>Ответ не был предоставлен</h3>
                  <p>
                    Срок выполнения задания истек, и вы не предоставили ответ на
                    это задание.
                  </p>
                </div>
              </section>
            )}
          </>
        )}
      </article>

      {/* Modal for viewing student answers (for teachers/admins) */}
      {showAnswerModal && (
        <div
          className={`${styles.assignment__modal} ${
            showAnswerModal ? styles.assignment__modalVisible : ""
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className={styles.assignment__modalContent}
            ref={modalContentRef}
          >
            <header className={styles.assignment__modalHeader}>
              <h2 id="modal-title" className={styles.assignment__modalTitle}>
                Ответ студента: {selectedAnswer?.student?.firstName}{" "}
                {selectedAnswer?.student?.lastName}
              </h2>
              <button
                className={styles.assignment__modalClose}
                onClick={closeAnswerModal}
                aria-label="Закрыть"
              >
                ×
              </button>
            </header>

            <div className={styles.assignment__modalBody}>
              {selectedAnswer?.fileLink && (
                <div className={styles.assignment__pdfWrapper}>
                  <h3 className={styles.assignment__answerSubtitle}>
                    Загруженный файл:
                  </h3>
                  <div className={styles.assignment__pdfContainer}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={selectedAnswer.fileLink}
                        plugins={[defaultLayoutPluginInstance]}
                      />
                    </Worker>
                  </div>
                </div>
              )}

              {selectedAnswer?.textAnswer && (
                <div className={styles.assignment__answerText}>
                  <h3 className={styles.assignment__answerSubtitle}>
                    Текстовый ответ:
                  </h3>
                  <div className={styles.assignment__answerTextContent}>
                    {selectedAnswer.textAnswer}
                  </div>
                </div>
              )}

              <div className={styles.assignment__submissionInfo}>
                <p>
                  <strong>Дата отправки:</strong>{" "}
                  {selectedAnswer
                    ? formatDate(selectedAnswer.submissionDate)
                    : ""}
                </p>
                <p>
                  <strong>Оценка:</strong>{" "}
                  {selectedAnswer && selectedAnswer.grade != null
                    ? selectedAnswer.grade
                    : "Не оценено"}
                </p>
              </div>

              {/* Form for grading the assignment */}
              <form
                className={styles.assignment__gradeForm}
                onSubmit={handleGradeSubmit}
              >
                <h3 className={styles.assignment__answerSubtitle}>
                  Оценить работу
                </h3>
                <div className={styles.assignment__gradeFormContent}>
                  <div className={styles["assignment__form-group"]}>
                    <label htmlFor="grade">Оценка:</label>
                    <input
                      type="number"
                      id="grade"
                      min="0"
                      max="100"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                      className={styles.assignment__input}
                      aria-required="true"
                    />
                  </div>
                  <div className={styles["assignment__form-group"]}>
                    <label htmlFor="feedback">Комментарий к работе:</label>
                    <textarea
                      id="feedback"
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className={styles.assignment__textarea}
                      rows={3}
                      placeholder="Введите комментарий к работе..."
                      aria-required="false"
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.assignment__button}
                    disabled={submittingGrade || !gradeValue}
                  >
                    {submittingGrade ? (
                      <>
                        <span
                          className={styles.assignment__buttonSpinner}
                        ></span>
                        <span>Сохранение...</span>
                      </>
                    ) : (
                      <>
                        <span className={styles.assignment__buttonIcon}>
                          💾
                        </span>
                        <span>Сохранить оценку</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
