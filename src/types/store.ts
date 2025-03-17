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
}


//State
export interface AuthState {
  user: User;
  accessToken: string;
  refreshToken: string;
  isAuth: boolean;
}
