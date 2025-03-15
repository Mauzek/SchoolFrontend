export interface Role {
    idRole: number;
    name: string;
  }
  
export interface AdditionalInfo{
    idEmployee?: number;
    idParent?: number;
    idStudent?: number;
    idClass?: number;
    classNumber?: number;
    classLetter?: string;
    parentId?: number;
    childrenIds?: number[];
}

  export interface User {
    id: number;
    email: string;
    role: Role;
    firstName: string;
    lastName: string;
    middleName: string;
    photo: string | null;
    additionalInfo: AdditionalInfo;
  }
  
  export interface AuthResponse {
    message: string;
    user: User;
    accessToken: string;
    refreshToken: string;
  }