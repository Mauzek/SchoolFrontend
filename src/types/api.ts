export interface ApiRole {
  idRole: number;
  name: string;
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
