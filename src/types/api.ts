import { Subject } from './';

export interface ApiRole {
  id: number;
  name: string;
}

export interface ApiClass {
  idClass: number;
  classNumber: number;
  classLetter: string;
}

export interface ApiPosition {
  id: number;
  name: string;
}

export interface ApiUser {
  id: number;
  email: string;
  role: ApiRole;
  firstName: string;
  lastName: string;
  middleName: string | null;
  photo: string | null;
  additionalInfo: ApiAdditionalInfo;
}

export interface ApiAdditionalInfo {
  idEmployee?: number;
  idParent?: number;
  idStudent?: number;
  idClass?: number;
  classNumber?: number;
  classLetter?: string;
  parentId?: number;
  childrenIds?: number[];
  position?: ApiPosition;
}

export interface ApiAuthResponse {
  message: string;
  user: ApiUser;
  accessToken: string;
  refreshToken: string;
  tokenRefreshed?: boolean;
}

export interface ApiTopStudent {
  idUser: number;
  idStudent: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  averageGrade: number;
  class: ApiClass;
  photo: string | null;
  rankingPosition: number;
  role: ApiRole;
}

export interface ApiTopStudentsResponse {
  message: string;
  data: ApiTopStudent[];
}

export interface ApiStudentDetails {
  student: {
    idStudent: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
    phone: string;
    birthDate: string;
    login: string;
    email: string;
    gender: 'male' | 'female';
    photo: string | null;
    documentNumber: string;
    bloodGroup: string;
  };
  class: ApiClass;
  parents: ApiParent[];
  distribution: Record<string, number>;
}

export interface ApiParent {
  idParent: number;
  type: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  photo: string | null;
}

export interface ApiEmployeeDetails {
  idEmployee: number;
  idUser: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: 'male' | 'female';
  photo: string | null;
  position: {
    idPosition: number;
    name: string;
  };
  role: {
    id: number;
    name: string;
  };
  maritalStatus: string;
  birthDate: string;
  phone: string;
  isStaff: boolean;
  passportSeries: string;
  passportNumber: string;
  workBookNumber: string;
  registrationAddress: string;
  workExperience: number;
  hireDate: string;
}

export interface ApiChildren {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  class: ApiClass;
  photo: string | null;
  role: ApiRole;
}

export interface ApiParentDetailsResponse {
  id: number;
  idUser: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string;
  photo: string | null;
  role: ApiRole;
  parentType: string;
  phone: string;
  workPhone: string | null;
  workplace: string;
  position: string;
  childrenCount: number;
  passportSeries: string;
  passportNumber: string;
  registrationAddress: string;
  children: ApiChildren[];
}

export interface ApiEmployeeDetailsResponse {
  message: string;
  data: ApiEmployeeDetails;
}

export interface ApiStudentDetailsResponse {
  message: string;
  data: ApiStudentDetails;
}

export interface ApiUpdateAvatarResponse {
  message: string;
  photo: string;
  user: {
    id: number;
    email: string;
    login: string
    role: ApiRole;
    firstName: string;
    lastName: string;
    middleName: string | null;
    photo: string | null;
    additionalInfo: ApiAdditionalInfo;
  };
}

export interface ApiScheduleItem {
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

export interface ApiChildrensResponse {
  student: {
    idStudent: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
    phone: string;
    birthDate: string;
    login: string;
    email: string;
    gender: 'male' | 'female';
    photo: string | null;
    documentNumber: string;
    bloodGroup: string;
  };
  class: ApiClass;
  parents: ApiParent[];
}

export interface ApiClassResponse {
  idClass: number;
  classNumber: number;
  classLetter: string;
  stydyYear: number;
  classTeacher: {
    idEmployee: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
  } | null;
  studentsCount: number;
}

export interface ApiAllClassesResponse {
  message: string;
  classes: ApiClassResponse[];
}

export interface ApiAllSubjectsResponse {
  message: string;
  subjects: {
    idSubject: number;
    name: string;
    description: string;
  }[];
}

export interface ApiCreateSchedule {
  idClass: number;
  idSubject: number;
  idEmployee: number;
  date: string;
  weekDay: string;
  startTime: string;
  endTime: string;
  roomNumber: string;
}

export interface ApiSubjectResponse{
  message: string;
  subject: {
    idSubject: number;
    name: string;
    description: string;
  }
}

export interface ApiTextbook {
  idTextbook: number;
  name: string;
  year: number;
  authors: string;
  isbn: string;
  fileLink: string;
  subject: {
    idSubject: number;
    name: string;
  };
}

export interface ApiTextbooksResponse {
  message: string;
  textbooks: ApiTextbook[];
}

export interface ApiAssignment {
  idAssignment: number;
  description: string;
  deadline: string;
  fileLink: string;
  subject: Subject;
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
  title: string;
  desctiption: string;
  openTime: string;
  closeTime: string;
  testing?: {
    idTesting: number;
    fileLink: string;
    attemptsCount: number;
  }
}

export interface ApiAssignmentResponse {
    message: string;
    data: ApiAssignment;
  }

export interface ApiAssignmentsResponse {
  message: string;
  data: ApiAssignment[];
}

// API Assignment Response type
export interface ApiAssignmentResponse {
  message: string;
  data: ApiAssignment;
}

// Student Assignment Answer type
export interface StudentAssignmentAnswer {
  message?: string;
  idAnswer: number;
  assignment: ApiAssignment;
  student: {
    idStudent: number;
    class: {
      idClass: number;
      classNumber: number;
      classLetter: string;
    };
    idUser: number;
    firstName: string;
    lastName: string;
    middleName: string;
  };
  grade: number | null;
  submissionDate: string;
  textAnswer: string;
  fileLink: string;
}

// Student Testing Answer type
export interface StudentTestingAnswer {
  idTestingAnswer: number;
  testing: {
    idTesting: number;
    fileLink: string;
    attemptsCount: number;
    assignment: ApiAssignment;
  };
  student: {
    idStudent: number;
    class: {
      idClass: number;
      classNumber: number;
      classLetter: string;
    };
    idUser: number;
    firstName: string;
    lastName: string;
    middleName: string;
  };
  grade: number | null;
  submissionDate: string;
  fileLink: string;
}

export interface ApiCreateAssignmentAnswer {
  idAssignment: number;
  idStudent: number;
  grade: number | null;
  submissionDate: string;
  textAnswer: string;
  fileLink: File | null;
}

export interface ApiCreateTestingAnswer {
  idTesting: number;
  idStudent: number;
  grade: number | null;
  submissionDate: string;
  fileLink: File | null;
}

export interface ApiCreateAssignment {
  idSubject: number;
  idClass: number;
  idEmployee: number;
  title: string;
  description: string;
  openTime: string;
  closeTime: string;
  fileLink: File | null
  isTesting: boolean;
  testingFileLink?: File | null;
  attemptsCount?: number;
}

export interface ApiAnswer {
  idAnswer: number;
  assignment: ApiAssignment;
  student: {
    idStudent: number;
    class: {
      idClass: number;
      classNumber: number;
      classLetter: string;
    };
    idUser: number;
    firstName: string;
    lastName: string;
    middleName: string;
  };
  grade: number | null;
  submissionDate: string;
  textAnswer: string;
  fileLink: string;
}

export interface ApiGradesResponse {
  student: {
    idStudent: number;
    firstName: string;
    lastName: string;
    middleName: string;
  },
  grades: {
    idGrade: number;
    idStudent: number;
    grade: number;
    gradeDate: string;
    gradeType: string;
    description: string;
    subject: {
      idSubject: number;
      name: string;
    };
  }[]
}

export interface ApiCreateGrade {
  idStudent: number;
  idSubject: number;
  gradeValue: number;
  gradeDate: string;
  gradeType: string;
  description: string;
}

export interface ApiUpdateGrade {
  gradeValue: number;
  gradeDate: string;
  gradeType: string;
  description: string;
}