import { Row, Col } from "antd";
import { SubjectCard } from "../";
import styles from "./SubjectsList.module.scss";
import { Subject } from "../../../types";

interface SubjectsListProps {
  subjects: Subject[];
}

export const SubjectsList = ({ subjects }: SubjectsListProps) => {
  return (
    <Row gutter={[24, 24]} className={styles.subjectsList}>
      {subjects.map((subject) => (
        <Col xs={24} sm={12} md={8} lg={6} key={subject.idSubject}>
          <SubjectCard subject={subject} />
        </Col>
      ))}
    </Row>
  );
};
