import React from "react";
import styles from "./StudentAnswerView.module.scss";
import { StudentAssignmentAnswer } from "../../../types";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface StudentAnswerViewProps {
  answer: StudentAssignmentAnswer | null;
}

export const StudentAnswerView: React.FC<StudentAnswerViewProps> = ({
  answer,
}) => {
  // Create the default layout plugin instance
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (!answer) {
    return null;
  }

  return (
    <section className={styles.answer}>
      <h2 className={styles.answer__title}>Ваш ответ</h2>
      <div className={styles.answer__container}>
        {answer.fileLink && (
          <div className={styles.answer__pdfWrapper}>
            <h3 className={styles.answer__subtitle}>Загруженный файл:</h3>
            <div className={styles.answer__pdfContainer}>
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer
                  fileUrl={answer.fileLink}
                  plugins={[defaultLayoutPluginInstance]}
                />
              </Worker>
            </div>
          </div>
        )}

        <div className={styles.answer__details}>
          {answer.textAnswer && (
            <div className={styles.answer__text}>
              <h3 className={styles.answer__subtitle}>Текстовый ответ:</h3>
              <div className={styles.answer__textContent}>
                {answer.textAnswer}
              </div>
            </div>
          )}

          <div className={styles.answer__grade}>
            <h3 className={styles.answer__subtitle}>Оценка:</h3>
            <div
              className={`${styles.answer__gradeValue} ${
                answer.grade !== null
                  ? styles.answer__gradeValue_set
                  : styles.answer__gradeValue_none
              }`}
            >
              {answer.grade !== null ? answer.grade : "Eщё не оценено"}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
