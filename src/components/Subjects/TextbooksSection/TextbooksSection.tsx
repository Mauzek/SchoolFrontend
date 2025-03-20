import React from "react";
import { Link } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { ApiTextbook } from "../../../types";
import { EmptyState } from "../../../components";
import { TextbookItem } from "../TextbookItem/TextbookItem";
import styles from "./TextbooksSection.module.scss";

interface TextbooksSectionProps {
  textbooks: ApiTextbook[];
  subjectId: string;
  isAdminOrTeacher: boolean;
}

export const TextbooksSection: React.FC<TextbooksSectionProps> = ({
  textbooks,
  subjectId,
  isAdminOrTeacher,
}) => {
  return (
    <div className={styles.textbooksSection}>
      <div className={styles.textbooksSection__header}>
        <h2 className={styles.textbooksSection__title}>Учебники по предмету</h2>

        {isAdminOrTeacher && (
          <Link
            to={`/subject/${subjectId}/add-textbook`}
            className={styles.textbooksSection__addButton}
          >
            <PlusOutlined /> Добавить учебник
          </Link>
        )}
      </div>

      {textbooks.length > 0 ? (
        <div className={styles.textbooksSection__list}>
          {textbooks.map((textbook) => (
            <TextbookItem key={textbook.idTextbook} textbook={textbook} />
          ))}
        </div>
      ) : (
        <EmptyState message="Учебники по данному предмету не найдены" />
      )}
    </div>
  );
};
