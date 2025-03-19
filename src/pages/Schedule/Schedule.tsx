import { useNavigate } from "react-router-dom";
import styles from "./Schedule.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import {
  getDayName,
  formatTime,
  ScheduleHeader,
  ScheduleDataProvider,
  StudentSelection,
  ScheduleControls,
  ScheduleContent,
} from "../../components";

export const Schedule = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  const userRole = user.user.role.id;
  const isAdmin = userRole === 1;
  const isParent = userRole === 4;

  // Function to check if a date is today
  const isToday = (dateString: string): boolean => {
    const today = new Date();
    const date = new Date(dateString);

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Handler for lesson click
  const handleLessonClick = (subjectId: number) => {
    navigate(`/subject/${subjectId}`);
  };

  // Handler to navigate to schedule creation page
  const handleNavigateToCreateSchedule = () => {
    navigate("/admin/schedule/create-schedule");
  };

  return (
    <ScheduleDataProvider>
      {({
        scheduleData,
        weekDates,
        isLoading,
        error,
        children,
        showStudentSelection,
        selectedStudentId,
        handlePreviousWeek,
        handleNextWeek,
        handleCurrentWeek,
        handleStudentSelect,
        handleBackToStudentSelection,
        getWeekDateRange,
      }) => {
        if (isLoading) {
          return (
            <div className={styles.schedule__loading}>
              <div className={styles.schedule__loadingSpinner}/>
              <p>Загрузка расписания...</p>
            </div>
          );
        }

        if (error) {
          return <div className={styles.schedule__error}>{error}</div>;
        }

        // Render student selection for parents
        if (isParent && showStudentSelection) {
          return (
            <div className={styles.schedule}>
              <StudentSelection
                children={children}
                onStudentSelect={handleStudentSelect}
              />
            </div>
          );
        }

        // Get selected child for title
        const selectedChild = selectedStudentId
          ? children.find(
              (child) => child.student.idStudent === selectedStudentId
            )
          : null;

        return (
          <div className={styles.schedule}>
            <ScheduleControls
              isParent={isParent}
              isAdmin={isAdmin}
              selectedStudentId={selectedStudentId}
              onBackToStudentSelection={handleBackToStudentSelection}
              onNavigateToCreateSchedule={handleNavigateToCreateSchedule}
            />

            <ScheduleHeader
              title={
                isParent && selectedChild
                  ? `Расписание ${selectedChild.student.lastName} ${selectedChild.student.firstName}`
                  : "Расписание на неделю"
              }
              dateRange={getWeekDateRange(weekDates)}
              onPreviousWeek={handlePreviousWeek}
              onCurrentWeek={handleCurrentWeek}
              onNextWeek={handleNextWeek}
            />

            <ScheduleContent
              weekDates={weekDates}
              scheduleData={scheduleData}
              onLessonClick={handleLessonClick}
              formatTime={formatTime}
              getDayName={getDayName}
              isToday={isToday}
            />
          </div>
        );
      }}
    </ScheduleDataProvider>
  );
};
