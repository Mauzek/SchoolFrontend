import React, { useRef, useState, useEffect } from "react";
import styles from "./AnswerModal.module.scss";
import { StudentAssignmentAnswer } from "../../../types";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import {
  updateAssignmentAnswer,
  updateTestingAnswer,
} from "../../../api/api-utils";

interface AnswerModalProps {
  answer: StudentAssignmentAnswer;
  isOpen: boolean;
  onClose: () => void;
  onGradeSubmit: () => void;
  accessToken: string;
  isTest: boolean;
}

export const AnswerModal: React.FC<AnswerModalProps> = ({
  answer,
  isOpen,
  onClose,
  onGradeSubmit,
  accessToken,
  isTest,
}) => {
  const modalContentRef = useRef<HTMLDivElement>(null);
  const [grade, setGrade] = useState<string>(answer.grade?.toString() || "");
  const [feedback, setFeedback] = useState<string>(answer.message || "");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Create the default layout plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalContentRef.current &&
        !modalContentRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  const handleSubmitGrade = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!grade) {
      setError("Пожалуйста, укажите оценку");
      return;
    }

    const gradeNumber = parseInt(grade);
    if (isNaN(gradeNumber) || gradeNumber < 0 || gradeNumber > 100) {
      setError("Оценка должна быть числом от 0 до 100");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      if (!isTest) {
        await updateAssignmentAnswer(gradeNumber, answer.idAnswer, accessToken);
      } else if (isTest) {
        await updateTestingAnswer(gradeNumber, answer.idAnswer, accessToken);
      }

      alert("Оценка успешно сохранена!");
      onGradeSubmit();
      onClose();
    } catch (err) {
      console.error("Error submitting grade:", err);
      setError("Ошибка при сохранении оценки. Пожалуйста, попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`${styles.modal} ${isOpen ? styles.modalVisible : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={styles.modal__content} ref={modalContentRef}>
        <header className={styles.modal__header}>
          <h2 id="modal-title" className={styles.modal__title}>
            Ответ студента: {answer.student?.firstName}{" "}
            {answer.student?.lastName}
          </h2>
          <button
            className={styles.modal__close}
            onClick={onClose}
            aria-label="Закрыть"
          >
            ×
          </button>
        </header>

        <div className={styles.modal__body}>
          {answer.fileLink && (
            <div className={styles.modal__pdfWrapper}>
              <h3 className={styles.modal__subtitle}>Загруженный файл:</h3>
              <div className={styles.modal__pdfContainer}>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={answer.fileLink}
                    plugins={[defaultLayoutPluginInstance]}
                  />
                </Worker>
              </div>
            </div>
          )}

          {answer.textAnswer && (
            <div className={styles.modal__answerText}>
              <h3 className={styles.modal__subtitle}>Текстовый ответ:</h3>
              <div className={styles.modal__answerTextContent}>
                {answer.textAnswer}
              </div>
            </div>
          )}

          <div className={styles.modal__submissionInfo}>
            <p>
              <strong>Дата отправки:</strong>{" "}
              {formatDate(answer.submissionDate)}
            </p>
            <p>
              <strong>Оценка:</strong>{" "}
              {answer.grade !== null ? answer.grade : "Не оценено"}
            </p>
          </div>

          {/* Form for grading the assignment */}
          <form
            className={styles.modal__gradeForm}
            onSubmit={handleSubmitGrade}
          >
            <h3 className={styles.modal__subtitle}>Оценить работу</h3>

            {error && (
              <div className={styles.modal__error}>
                <div className={styles.modal__errorIcon}>⚠️</div>
                <p>{error}</p>
              </div>
            )}

            <div className={styles.modal__gradeFormContent}>
              <div className={styles.modal__formGroup}>
                <label htmlFor="grade" className={styles.modal__label}>
                  Оценка:
                </label>
                <input
                  type="number"
                  id="grade"
                  min="0"
                  max="100"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className={styles.modal__input}
                  aria-required="true"
                />
              </div>
              <div className={styles.modal__formGroup}>
                <label htmlFor="feedback" className={styles.modal__label}>
                  Комментарий к работе:
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className={styles.modal__textarea}
                  rows={3}
                  placeholder="Введите комментарий к работе..."
                  aria-required="false"
                />
              </div>
              <button
                type="submit"
                className={styles.modal__button}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className={styles.modal__buttonSpinner}></span>
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <span className={styles.modal__buttonIcon}>💾</span>
                    <span>Сохранить оценку</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
