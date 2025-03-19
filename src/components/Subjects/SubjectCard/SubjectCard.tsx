import { Link } from "react-router-dom";
import {
  BookOutlined,
  CalculatorOutlined,
  HistoryOutlined,
  ExperimentOutlined,
  MedicineBoxOutlined,
  ReadOutlined,
  GlobalOutlined,
  RocketOutlined,
} from "@ant-design/icons"; // Оставляем только иконки
import styles from "./SubjectCard.module.scss";
import { Subject } from "../../../types";

interface SubjectCardProps {
  subject: Subject;
}

export const SubjectCard = ({ subject }: SubjectCardProps) => {
  // Функция для получения случайного цвета из предопределенного набора
  const getSubjectColor = (id: number) => {
    const colors = [
      "var(--color-primary)",
      "var(--color-secondary)",
      "#4caf50",
      "#ff9800",
      "#9c27b0",
      "#3f51b5",
      "#e91e63",
      "#009688",
    ];

    return colors[id % colors.length];
  };

  // Функция для получения иконки предмета
  const getSubjectIcon = (name: string) => {
    const lowerName = name.toLowerCase();

    if (lowerName.includes("math") || lowerName.includes("матем")) {
      return <CalculatorOutlined />;
    } else if (lowerName.includes("history") || lowerName.includes("истор")) {
      return <HistoryOutlined />;
    } else if (lowerName.includes("physics") || lowerName.includes("физик")) {
      return <RocketOutlined />;
    } else if (lowerName.includes("chemistry") || lowerName.includes("хими")) {
      return <ExperimentOutlined />;
    } else if (lowerName.includes("biology") || lowerName.includes("биолог")) {
      return <MedicineBoxOutlined />;
    } else if (
      lowerName.includes("literature") ||
      lowerName.includes("литерат")
    ) {
      return <ReadOutlined />;
    } else if (
      lowerName.includes("geography") ||
      lowerName.includes("географ")
    ) {
      return <GlobalOutlined />;
    }

    return <BookOutlined />;
  };

  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const subjectColor = getSubjectColor(subject.idSubject);

  return (
    <Link
      to={`/subject/${subject.idSubject}`}
      className={styles.subjectCard__link}
    >
      <div
        className={styles.subjectCard}
        style={{ borderTopColor: subjectColor }}
      >
        <div
          className={styles.subjectCard__icon}
          style={{ color: subjectColor }}
        >
          {getSubjectIcon(subject.name)}
        </div>
        <h3 className={styles.subjectCard__title}>{subject.name}</h3>
        <p className={styles.subjectCard__description}>
          {truncateDescription(subject.description)}
        </p>
        <div className={styles.subjectCard__footer}>
          <span className={styles.subjectCard__more}>Подробнее</span>
        </div>
      </div>
    </Link>
  );
};
