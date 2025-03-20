import React from "react";
import { BookOutlined, DownloadOutlined } from "@ant-design/icons";
import { ApiTextbook } from "../../../types";
import styles from "./TextbookItem.module.scss";

interface TextbookItemProps {
  textbook: ApiTextbook;
}

export const TextbookItem: React.FC<TextbookItemProps> = React.memo(
  ({ textbook }) => (
    <div className={styles.textbook}>
      <div className={styles.textbook__icon}>
        <BookOutlined />
      </div>
      <div className={styles.textbook__content}>
        <h3 className={styles.textbook__title}>{textbook.name}</h3>
        <p className={styles.textbook__authors}>{textbook.authors}</p>
        <div className={styles.textbook__details}>
          <span className={styles.textbook__year}>
            Год издания: {textbook.year}
          </span>
          {textbook.isbn && (
            <span className={styles.textbook__isbn}>ISBN: {textbook.isbn}</span>
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
  )
);
