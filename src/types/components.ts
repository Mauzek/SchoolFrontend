// <-------Header.tsx------->
import type { Dayjs } from "dayjs";
import { ApiChildrensResponse } from "./api";

// Определение типа для навигационных ссылок 
export interface NavLink {
    to: string;
    icon: React.ReactNode;
    text: string;
  }
// <-------NewsSection.tsx------->
// Определение типа для новостей
export interface NewsItem {
    id: number;
    title: string;
    content: string;
    date: string;
    image?: string;
    category: string;
  }

// <-------ProfileHeader.tsx------->
// Определение типа для свойств компонента ProfileHeader
export interface ProfileHeaderProps {
    photo: string | null;
    name: string;
    details: React.ReactNode[];
    photoAlt: string;
  }

// <-------Shedule.tsx------->
// Определение типа для свойств компонента Schedule

interface ScheduleItem {
  idSchedule: number;
  subject: {
    idSubject: number;
    subjectName: string;
  };
  date: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  class: {
    idClass: number;
    classNumber: number;
    classLetter: string;
  };
  employee: {
    idEmployee: number;
    firstName: string;
    lastName: string;
    middleName: string;
  };
}

export interface ScheduleData {
  [date: string]: ScheduleItem[];
}

// <-------ScheduleHeader.tsx------->
// Определение типа для свойств компонента ScheduleHeader
export interface ScheduleHeaderProps {
  title: string;
  dateRange: string;
  onPreviousWeek: () => void;
  onCurrentWeek: () => void;
  onNextWeek: () => void;
}

// <-------ScheduleDay.tsx------->
// Определение типа для свойств компонента ScheduleItem
export interface ScheduleDayProps {
  date: string;
  dayName: string;
  lessons: ScheduleItem[];
  onLessonClick: (subjectId: number) => void;
  formatTime: (time: string) => string;
  isToday: boolean;
}

// <-------ScheduleLesson.tsx------->
// Определение типа для свойств компонента ScheduleLesson
export interface ScheduleLessonProps {
  lesson: ScheduleItem;
  onLessonClick: (subjectId: number) => void;
  formatTime: (time: string) => string;
}

// <-------StudentSelection.tsx------->
// Определение типа для свойств компонента StudentSelection
export interface StudentSelectionProps {
  children: ApiChildrensResponse[];
  onStudentSelect: (studentId: number) => void;
}

// <-------ScheduleControls.tsx------->
// Определение типа для свойств компонента ScheduleControls
export interface ScheduleControlsProps {
  isParent: boolean;
  isAdmin: boolean;
  selectedStudentId: number | null;
  onBackToStudentSelection: () => void;
  onNavigateToCreateSchedule: () => void;
}

// <-------ScheduleContent.tsx------->
// Определение типа для свойств компонента ScheduleContent
export interface ScheduleContentProps {
  weekDates: string[];
  scheduleData: ScheduleData;
  onLessonClick: (subjectId: number) => void;
  formatTime: (time: string) => string;
  getDayName: (date: string) => string;
  isToday: (date: string) => boolean;
}


// <-------CreateSchedule.tsx------->
// Определение типа для свойств компонента CreateSchedule
export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface CreateScheduleItem {
  idClass: number;
  idSubject: number;
  idEmployee: number;
  date: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
  subjectName?: string;
  teacherName?: string;
}

export interface LessonFormValues {
  subjectId?: number;
  employeeId?: number;
  roomNumber?: string;
  date?: Dayjs | null;
  classId?: number;
}

// <-------Subject.tsx------->
// Определение типа для свойств компонента Subjects
export interface Subject {
  idSubject: number;
  name: string;
  description: string;
}