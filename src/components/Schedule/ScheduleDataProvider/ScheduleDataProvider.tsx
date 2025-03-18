import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  getClassScheduleByWeekInterval,
  getEmployeeScheduleByWeekInterval,
  getStudentsByParentId,
} from "../../../api/api-utils";
import { ScheduleData, ApiChildrensResponse } from "../../../types";
import { getWeekDates, generateWeekDates } from "../../index";

interface ScheduleDataProviderProps {
  children: (props: {
    scheduleData: ScheduleData;
    weekDates: string[];
    isLoading: boolean;
    error: string | null;
    children: ApiChildrensResponse[];
    showStudentSelection: boolean;
    selectedStudentId: number | null;
    currentWeekOffset: number;
    handlePreviousWeek: () => void;
    handleNextWeek: () => void;
    handleCurrentWeek: () => void;
    handleStudentSelect: (studentId: number) => void;
    handleBackToStudentSelection: () => void;
    getWeekDateRange: (weekDates: string[]) => string;
  }) => React.ReactNode;
}

export const ScheduleDataProvider: React.FC<ScheduleDataProviderProps> = ({
  children,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [scheduleData, setScheduleData] = useState<ScheduleData>({});
  const [weekDates, setWeekDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekOffset, setCurrentWeekOffset] = useState<number>(0);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [childrenData, setChildrenData] = useState<ApiChildrensResponse[]>([]);
  const [showStudentSelection, setShowStudentSelection] =
    useState<boolean>(false);

  const userRole = user.user.role.id;
  const isEmployee = userRole === 2;
  const isParent = userRole === 4;

  // Function to get week date range for display
  const getWeekDateRange = (weekDates: string[]): string => {
    if (weekDates.length === 0) return "";

    const startDate = new Date(weekDates[0]);
    const endDate = new Date(weekDates[weekDates.length - 1]);

    const formatDateForDisplay = (date: Date): string => {
      return date.toLocaleDateString("ru-RU");
    };

    return `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(
      endDate
    )}`;
  };

  // Function to fetch parent's children
  const fetchChildren = async () => {
    if (!isParent || !user.user?.id) return;

    try {
      setIsLoading(true);
      const response =
        user.user.additionalInfo.idParent &&
        (await getStudentsByParentId(
          user.user.additionalInfo.idParent,
          user.accessToken
        ));

      if (response) {
        setChildrenData(response);
        setShowStudentSelection(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading children:", error);
      setError("Ошибка загрузки данных");
      setIsLoading(false);
    }
  };

  // Function to fetch schedule data based on user role
  const fetchScheduleData = async (weekOffset: number) => {
    try {
      setIsLoading(true);
      const { startDate, endDate } = getWeekDates(weekOffset);
      const weekDates = generateWeekDates(startDate);
      setWeekDates(weekDates);

      let response;

      if (isEmployee && user.user?.id) {
        // Fetch employee's schedule
        response = await getEmployeeScheduleByWeekInterval(
          user.user.id,
          startDate,
          endDate,
          user.accessToken
        );
      } else if (isParent && selectedStudentId) {
        // Fetch selected student's class schedule
        const selectedChild = childrenData.find(
          (child) => child.student.idStudent === selectedStudentId
        );
        if (!selectedChild) {
          setError("Информация о ребенке не найдена");
          setIsLoading(false);
          return;
        }

        response = await getClassScheduleByWeekInterval(
          selectedChild.class.idClass,
          startDate,
          endDate,
          user.accessToken
        );
      } else if (user.user?.additionalInfo?.idClass) {
        // Fetch student's class schedule
        response = await getClassScheduleByWeekInterval(
          user.user.additionalInfo.idClass,
          startDate,
          endDate,
          user.accessToken
        );
      } else {
        setIsLoading(false);
        return;
      }

      if (response && response.data) {
        setScheduleData(response.data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading schedule:", error);
      setError("Ошибка загрузки расписания");
      setIsLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    if (isParent) {
      fetchChildren();
    } else {
      fetchScheduleData(currentWeekOffset);
    }
  }, [user, isParent]);

  // Load schedule when student is selected or week changes
  useEffect(() => {
    if (isParent) {
      if (selectedStudentId) {
        fetchScheduleData(currentWeekOffset);
      }
    }
  }, [selectedStudentId, currentWeekOffset]);

  // Load schedule when week changes (for non-parent users)
  useEffect(() => {
    if (!isParent) {
      fetchScheduleData(currentWeekOffset);
    }
  }, [currentWeekOffset]);

  // Navigation handlers
  const handlePreviousWeek = () => {
    setCurrentWeekOffset(currentWeekOffset - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekOffset(currentWeekOffset + 1);
  };

  const handleCurrentWeek = () => {
    setCurrentWeekOffset(0);
  };

  // Handler for student selection
  const handleStudentSelect = (studentId: number) => {
    setSelectedStudentId(studentId);
    setShowStudentSelection(false);
  };

  // Handler to go back to student selection
  const handleBackToStudentSelection = () => {
    setSelectedStudentId(null);
    setShowStudentSelection(true);
    setScheduleData({});
  };

  return (
    <>
      {children({
        scheduleData,
        weekDates,
        isLoading,
        error,
        children: childrenData,
        showStudentSelection,
        selectedStudentId,
        currentWeekOffset,
        handlePreviousWeek,
        handleNextWeek,
        handleCurrentWeek,
        handleStudentSelect,
        handleBackToStudentSelection,
        getWeekDateRange,
      })}
    </>
  );
};
