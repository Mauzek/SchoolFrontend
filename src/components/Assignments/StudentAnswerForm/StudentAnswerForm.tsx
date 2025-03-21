import React, { useState } from 'react';
import styles from './StudentAnswerForm.module.scss';
import { ApiAssignment, AuthState } from '../../../types';
import { createAssignmentAnswer, createTestingAnswer } from '../../../api/api-utils';

interface StudentAnswerFormProps {
  assignment: ApiAssignment;
  user: AuthState;
  onSubmitSuccess: () => void;
}

export const StudentAnswerForm: React.FC<StudentAnswerFormProps> = ({ 
  assignment, 
  user, 
  onSubmitSuccess 
}) => {
  const [textAnswer, setTextAnswer] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Пожалуйста, загрузите PDF файл.");
      return;
    }

    setSubmitting(true);
    setError(null);

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

        if (assignment.testing) {
          formData.append("idTesting", assignment.testing.idTesting.toString());
          await createTestingAnswer(formData, user.accessToken);
        } else {
          formData.append("idAssignment", assignment.idAssignment.toString());
          await createAssignmentAnswer(formData, user.accessToken);
        }

        setTextAnswer("");
        setFile(null);
        
        onSubmitSuccess();
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Произошла ошибка при отправке ответа. Пожалуйста, попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={styles.form}>
      <h2 className={styles.form__title}>Отправить ответ</h2>
      
      {error && (
        <div className={styles.form__error}>
          <div className={styles.form__errorIcon}>⚠️</div>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmitAnswer} className={styles.form__container}>
        <div className={styles.form__group}>
          <label htmlFor="file" className={styles.form__label}>Загрузить PDF файл:</label>
          <input
            type="file"
            id="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
            className={styles.form__input}
            aria-required="true"
          />
          {file && (
            <div className={styles.form__fileSelected}>
              <span className={styles.form__fileIcon}>📄</span>
              <span>Выбран файл: {file.name}</span>
            </div>
          )}
        </div>

        <div className={styles.form__group}>
          <label htmlFor="textAnswer" className={styles.form__label}>
            Текстовый ответ (необязательно):
          </label>
          <textarea
            id="textAnswer"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            className={styles.form__textarea}
            rows={5}
            placeholder="Введите ваш ответ здесь..."
            aria-required="false"
          />
        </div>

        <button
          type="submit"
          className={styles.form__button}
          disabled={submitting || !file}
          aria-busy={submitting}
        >
          {submitting ? (
            <>
              <span className={styles.form__buttonSpinner}></span>
              <span>Отправка...</span>
            </>
          ) : (
            <>
              <span className={styles.form__buttonIcon}>📤</span>
              <span>Отправить ответ</span>
            </>
          )}
        </button>
      </form>
    </section>
  );
};
