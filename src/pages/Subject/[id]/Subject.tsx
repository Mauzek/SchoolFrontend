import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOutlined, FileTextOutlined } from "@ant-design/icons";
import { RootState } from "../../../store";
import {
  getSubjectById,
  getAssignmentsBySubjectIdAndClassId,
  getTextbooksBySubjectId,
  getAllClasses,
} from "../../../api/api-utils";
import { EmptyState } from "../../../components/EmptyState/EmptyState";
import { ApiTextbook, ApiAssignment, Subject as ApiSubject, ApiClassResponse } from "../../../types";
import { SubjectHeader,TextbooksSection, AssignmentsSection,  } from "../../../components";
import { getSubjectColor, getSubjectIcon, isTestAssignment } from "../../../utils/subjectUtils";
import styles from "./Subject.module.scss";

export const Subject: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.user);
  const location = useLocation();
  const navigate = useNavigate();

  const [subject, setSubject] = useState<ApiSubject | null>(null);
  const [textbooks, setTextbooks] = useState<ApiTextbook[]>([]);
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"textbooks" | "assignments">("textbooks");
  const [classes, setClasses] = useState<ApiClassResponse[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [loadingAssignments, setLoadingAssignments] = useState<boolean>(false);

  // Проверяем, является ли пользователь админом или учителем
  const isAdminOrTeacher = useMemo(() => {
    return user.user.role.id === 1 || user.user.role.id === 2;
  }, [user.user.role.id]);

  // Загрузка списка классов
  useEffect(() => {
    if (isAdminOrTeacher) {
      const fetchClasses = async () => {
        try {
          const classesResponse = await getAllClasses(user.accessToken);
          if (classesResponse && classesResponse.classes) {
            setClasses(classesResponse.classes);
          }
        } catch (error) {
          console.error("Ошибка при загрузке классов:", error);
        }
      };

      fetchClasses();
    }
  }, [isAdminOrTeacher, user.accessToken]);

  // Загрузка информации о предмете и учебниках
  useEffect(() => {
    const fetchSubjectAndTextbooks = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // Получаем информацию о предмете
        const subjectResponse = await getSubjectById(parseInt(id), user.accessToken);
        if (subjectResponse && subjectResponse.subject) {
          setSubject(subjectResponse.subject);
        }

        // Получаем учебники по предмету
        const textbooksResponse = await getTextbooksBySubjectId(parseInt(id), user.accessToken);
        if (textbooksResponse && textbooksResponse.textbooks) {
          setTextbooks(textbooksResponse.textbooks);
        }

        setLoading(false);
      } catch (error) {
        console.error("Ошибка при загрузке данных предмета:", error);
        setLoading(false);
      }
    };

    fetchSubjectAndTextbooks();
  }, [id, user.accessToken]);

  // Определение выбранного класса и загрузка заданий
  useEffect(() => {
    const determineClassAndLoadAssignments = async () => {
      if (!id || loading) return;

      try {
        // Определяем ID класса для загрузки заданий
        let classId: number | null = null;

        // Если есть ID класса в состоянии, используем его
        if (selectedClass) {
          classId = selectedClass;
        }
        // Иначе используем ID класса из location state или из профиля пользователя
        else if (location.state?.idClass) {
          classId = location.state.idClass;
          setSelectedClass(classId);

          // Находим имя класса
          if (classes.length > 0) {
            const classInfo = classes.find((c) => c.idClass === classId);
            if (classInfo) {
              setSelectedClassName(`${classInfo.classNumber}${classInfo.classLetter}`);
            }
          }
        } else if (user.user.additionalInfo.idClass) {
          classId = user.user.additionalInfo.idClass;
          setSelectedClass(classId);

          // Находим имя класса для студента
          if (classes.length > 0) {
            const classInfo = classes.find((c) => c.idClass === classId);
            if (classInfo) {
              setSelectedClassName(`${classInfo.classNumber}${classInfo.classLetter}`);
            }
          }
        }

        // Если есть ID класса и активна вкладка заданий, загружаем задания
        if (classId && activeTab === "assignments") {
          setLoadingAssignments(true);

          const assignmentsResponse = await getAssignmentsBySubjectIdAndClassId(
            parseInt(id),
            classId,
            user.accessToken
          );

          if (assignmentsResponse && assignmentsResponse.data) {
            setAssignments(assignmentsResponse.data);
          } else {
            setAssignments([]);
          }

          setLoadingAssignments(false);
        }
      } catch (error) {
        console.error("Ошибка при определении класса и загрузке заданий:", error);
        setLoadingAssignments(false);
      }
    };

    determineClassAndLoadAssignments();
  }, [
    id,
    classes,
    selectedClass,
    user.user.additionalInfo.idClass,
    location.state,
    loading,
    activeTab,
    user.accessToken,
  ]);

  // Обработчик выбора класса
  const handleClassSelect = useCallback(
    async (classId: number) => {
      if (!id) return;

      setSelectedClass(classId);

      const classInfo = classes.find((c) => c.idClass === classId);
      if (classInfo) {
        setSelectedClassName(`${classInfo.classNumber}${classInfo.classLetter}`);
      }

      try {
        setLoadingAssignments(true);

        // Загружаем задания для выбранного класса
        const assignmentsResponse = await getAssignmentsBySubjectIdAndClassId(
          parseInt(id),
          classId,
          user.accessToken
        );

        if (assignmentsResponse && assignmentsResponse.data) {
          setAssignments(assignmentsResponse.data);
        } else {
          setAssignments([]);
        }
      } catch (error) {
        console.error("Ошибка при загрузке заданий:", error);
        setAssignments([]);
      } finally {
        setLoadingAssignments(false);
      }

      // Обновляем URL с параметром класса
      navigate(`/subject/${id}`, { state: { idClass: classId } });
    },
    [id, classes, user.accessToken, navigate]
  );

  // Мемоизируем фильтрацию тестовых и обычных заданий
  const testAssignments = useMemo(() => {
    return assignments.filter(isTestAssignment);
  }, [assignments]);

  const regularAssignments = useMemo(() => {
    return assignments.filter((a) => !isTestAssignment(a));
  }, [assignments]);

  // Обработчик переключения вкладок
  const handleTabChange = useCallback(
    (tab: "textbooks" | "assignments") => {
      setActiveTab(tab);

      // Если переключаемся на вкладку заданий и есть выбранный класс, но нет загруженных заданий
      if (
        tab === "assignments" &&
        selectedClass &&
        assignments.length === 0 &&
        !loadingAssignments
      ) {
        handleClassSelect(selectedClass);
      }
    },
    [selectedClass, assignments.length, loadingAssignments, handleClassSelect]
  );

  if (loading && !subject) {
    return (
      <div className={styles.subject__loading}>
        <div className={styles.subject__spinner} />
        <p className={styles.subject__loadingText}>Загрузка...</p>
      </div>
    );
  }

  if (!subject) {
    return <EmptyState message="Предмет не найден" />;
  }

  return (
    <div className={styles.subject}>
      <SubjectHeader 
        subject={subject} 
        color={getSubjectColor(subject.idSubject)} 
        icon={getSubjectIcon(subject.name)} 
      />

      <div className={styles.subject__tabs}>
        <button
          className={`${styles.subject__tab} ${
            activeTab === "textbooks" ? styles.subject__tabActive : ""
          }`}
          onClick={() => handleTabChange("textbooks")}
        >
          <BookOutlined /> Учебники
        </button>
        <button
          className={`${styles.subject__tab} ${
            activeTab === "assignments" ? styles.subject__tabActive : ""
          }`}
          onClick={() => handleTabChange("assignments")}
        >
          <FileTextOutlined /> Задания
        </button>
      </div>

      <div className={styles.subject__content}>
        {activeTab === "textbooks" && (
          <TextbooksSection 
            textbooks={textbooks} 
            subjectId={id || ""} 
            isAdminOrTeacher={isAdminOrTeacher} 
          />
        )}

        {activeTab === "assignments" && (
          <AssignmentsSection
            assignments={assignments}
            testAssignments={testAssignments}
            regularAssignments={regularAssignments}
            subjectId={id || ""}
            isAdminOrTeacher={isAdminOrTeacher}
            selectedClass={selectedClass}
            selectedClassName={selectedClassName}
            classes={classes}
            onClassSelect={handleClassSelect}
            loadingAssignments={loadingAssignments}
          />
        )}
            </div>
    </div>
  );
};
