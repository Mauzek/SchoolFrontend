export interface Role {
  id: number;
  name: string;
}

export interface Position {
  id: number;
  name: string;
}

export interface Class {
  id: number;
  number: number;
  letter: string;
}

export interface AdditionalInfo {
  idEmployee?: number;
  idParent?: number;
  idStudent?: number;
  idClass?: number;
  classNumber?: number;
  classLetter?: string;
  parentId?: number;
  childrenIds?: number[];
  position?: Position;
}

export interface User {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  middleName: string | null;
  photo: string | null;
  additionalInfo: AdditionalInfo;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
  refreshToken: string;
  tokenRefreshed?: boolean;
}


export interface TopStudent {
  uid: number;
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  averageGrade: number;
  class: Class;
  photo: string | null;
  rankingPosition: number;
  role: Role;
}

export interface StudentDetails {
  student: {
    id: number;
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
  class: {
    id: number;
    number: number;
    letter: string;
  };
  parents: {
    id: number;
    firstName: string;
    lastName: string;
    middleName: string | null;
  }[];
  distribution: Record<string, number>;
}

export interface EmployeeDetails {
  id: number;
  userId: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: 'male' | 'female';
  photo: string | null;
  position: {
    id: number;
    name: string;
  };
  role: {
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

export interface Children {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string | null;
  class: Class;
  photo: string | null;
  role: Role;
}

export interface ParentDetails {
  id: number;
  idUser: number;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  gender: string;
  photo: string | null;
  role: Role;
  parentType: string;
  phone: string;
  workPhone: string | null;
  workplace: string;
  position: string;
  childrenCount: number;
  passportSeries: string;
  passportNumber: string;
  registrationAddress: string;
  children: Children[];
}

export interface updateAvatarDetails{
  message: string;
  photo: string;
}

//State
export interface AuthState {
  user: User;
  accessToken: string;
  refreshToken: string;
  isAuth: boolean;
}
