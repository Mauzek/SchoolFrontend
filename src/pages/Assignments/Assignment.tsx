import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import styles from "./Assignment.module.scss";
import {
  getAssignmentById,
  getStudentAssignmentAnswer,
  getStudentTestingAnswer,
  getAllAssignmentAnswersByAssignmentID,
  getAllTestingAnswersByTestingID,
} from "../../api/api-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { ApiAssignment, StudentAssignmentAnswer } from "../../types";
import { SubjectHeader } from "../../components/Subjects";
import { AssignmentHeader,AssignmentDescription,StudentAnswerForm,StudentAnswerView,TeacherAnswersList,AnswerModal } from "../../components";


export const Assignment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const [assignment, setAssignment] = useState<ApiAssignment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [assignmentAnswer, setAssignmentAnswer] = useState<StudentAssignmentAnswer | null>(null);
  const [allAnswers, setAllAnswers] = useState<StudentAssignmentAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<StudentAssignmentAnswer | null>(null);
  const [showAnswerModal, setShowAnswerModal] = useState<boolean>(false);

  // Check if user is teacher or admin
  const isTeacherOrAdmin = user.user.role?.id === 1 || user.user.role?.id === 2;

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
        if (isTeacherOrAdmin && location.state.isTest === false) {
          const allAnswersData = await getAllAssignmentAnswersByAssignmentID(
            parseInt(id),
            user.accessToken
          );
          console.log(allAnswersData);
          setAllAnswers(allAnswersData.data);
        }

        // For teachers and admins, fetch all answers
        if (isTeacherOrAdmin && location.state.isTest === true) {
          const allAnswersData = await getAllTestingAnswersByTestingID(
            location.state.idTesting,
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
  }, [id, user.accessToken, user.user.additionalInfo.idStudent, isTeacherOrAdmin,  location.state]);;

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

  const refreshAnswers = async () => {
    if (!id) return;
    
    try {
      // Refresh assignment data
      const assignmentData = await getAssignmentById(
        parseInt(id),
        user.accessToken
      );
      setAssignment(assignmentData.data);
      
      // For teachers, refresh all answers
        // For teachers and admins, fetch all answers
        if (isTeacherOrAdmin && location.state.isTest === false) {
          const allAnswersData = await getAllAssignmentAnswersByAssignmentID(
            parseInt(id),
            user.accessToken
          );
          console.log(allAnswersData);
          setAllAnswers(allAnswersData.data);
        }

        // For teachers and admins, fetch all answers
        if (isTeacherOrAdmin && location.state.isTest === true) {
          const allAnswersData = await getAllTestingAnswersByTestingID(
            location.state.idTesting,
            user.accessToken
          );
          setAllAnswers(allAnswersData.data);
        }
      // For students, refresh their answer
      else if (user.user.additionalInfo.idStudent) {
        if (assignmentData.data.testing) {
          const answer = await getStudentTestingAnswer(
            user.user.additionalInfo.idStudent,
            assignmentData.data.testing.idTesting,
            user.accessToken
          );
          setAssignmentAnswer(answer.data);
        } else if (assignmentData.data.idAssignment) {
          const answer = await getStudentAssignmentAnswer(
            user.user.additionalInfo.idStudent,
            assignmentData.data.idAssignment,
            user.accessToken
          );
          setAssignmentAnswer(answer.data);
        }
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    }
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

  const hasAnswer = assignmentAnswer !== undefined;
  const isOverdue = new Date(assignment.closeTime) < new Date();

  return (
    <main className={styles.assignment}>
      <SubjectHeader icon="📝" color="#FFC107" subject={assignment.subject} />

      <article className={styles.assignment__card}>
        <AssignmentHeader assignment={assignment} />
        
        <AssignmentDescription assignment={assignment} />
        
        {/* Teacher/Admin view - List of all answers */}
        {isTeacherOrAdmin && (
          <TeacherAnswersList 
            answers={allAnswers} 
            onViewAnswer={handleViewAnswer} 
          />
        )}

        {/* Student view - Their own answer or submission form */}
        {!isTeacherOrAdmin && (
          <>
            {hasAnswer ? (
              <StudentAnswerView answer={assignmentAnswer} />
            ) : !isOverdue ? (
              <StudentAnswerForm 
                assignment={assignment} 
                user={user} 
                onSubmitSuccess={refreshAnswers} 
              />
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
      {showAnswerModal && selectedAnswer && (
        <AnswerModal 
          answer={selectedAnswer} 
          isOpen={showAnswerModal} 
          onClose={closeAnswerModal} 
          onGradeSubmit={refreshAnswers}
          accessToken={user.accessToken}
          isTest={location.state.isTest}
        />
      )}
    </main>
  );
};
