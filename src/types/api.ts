export interface ApiRole {
  idRole: number;
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
}

export interface ApiTopStudentsResponse {
  message: string;
  data: ApiTopStudent[];
}