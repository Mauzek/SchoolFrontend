import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./Subjects.module.scss";
import { RootState } from "../../store";
import { getAllSubjects } from "../../api/api-utils";
import { SubjectsMainHeader, SubjectsList, EmptyState } from "../../components";
import { Subject } from "../../types";

export const Subjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchValue, setSearchValue] = useState<string>("");

  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const response = await getAllSubjects(user.accessToken);

        if (response && response.subjects) {
          setSubjects(response.subjects);
          setFilteredSubjects(response.subjects);
        }
      } catch (error) {
        console.error("Ошибка при загрузке предметов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [user.accessToken]);

  const handleSearch = (value: string) => {
    setSearchValue(value);

    if (!value.trim()) {
      setFilteredSubjects(subjects);
      return;
    }

    const filtered = subjects.filter(
      (subject) =>
        subject.name.toLowerCase().includes(value.toLowerCase()) ||
        subject.description.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredSubjects(filtered);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.subjects}>
          <div className={styles.subjects__spinner} />
          <p className={styles.subjects__text}>Загрузка...</p>
        </div>
      );
    }

    if (filteredSubjects.length === 0) {
      return <EmptyState message="Предметы не найдены" />;
    }

    return <SubjectsList subjects={filteredSubjects} />;
  };

  return (
    <div className={styles.subjects}>
      <SubjectsMainHeader
        searchValue={searchValue}
        onSearch={handleSearch}
      />
      {renderContent()}
    </div>
  );
};
