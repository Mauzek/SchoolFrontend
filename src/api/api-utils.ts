import axios from "axios";
import { endpoints } from "./config";
import { ApiAuthResponse, ApiTopStudent, ApiTopStudentsResponse, AuthResponse, TopStudent } from "../types";

// Запросы к API
const login = async (login: string, password: string ): Promise<AuthResponse> => {
  const response = await axiosRequest("post", endpoints.login, undefined, {
    login,
    password,
  });
  return normalizeAuthResponse(response);
};

const loginWithJWT = async (accessToken: string, refreshToken: string): Promise<AuthResponse> => {
  const response = await axiosRequest("post", endpoints.loginWithJWT, undefined, {
    accessToken,
    refreshToken,
  });
  return normalizeAuthResponse(response);
};

const getTopStudents = async (token: string): Promise<TopStudent[]> => {
  const response = await axiosRequest("get", endpoints.getTopStudents, token);
  return normalizeTopStudentsResponse(response);
};


// Api-utils
const axiosRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  token?: string,
  data?: any
) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await axios({ method, url, headers, data });
    return response.data;
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    throw error;
  }
};

const normalizeAuthResponse = (data: ApiAuthResponse): AuthResponse => {
  return {
    message: data.message,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: {
        id: data.user.role.idRole,
        name: data.user.role.name,
      },
      firstName: data.user.firstName,
      lastName: data.user.lastName,
      middleName: data.user.middleName,
      photo: data.user.photo,
      additionalInfo: data.user.additionalInfo,
    },
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
};

const normalizeTopStudentsResponse = (data: ApiTopStudentsResponse): TopStudent[] => {
  return data.data.map((student: ApiTopStudent) => ({
    uid: student.idUser,
    id: student.idStudent,
    firstName: student.firstName,
    lastName: student.lastName,
    middleName: student.middleName,
    averageGrade: student.averageGrade,
    class: {
      id: student.class.idClass,
      number: student.class.classNumber,
      letter: student.class.classLetter,
    },
    photo: student.photo,
    rankingPosition: student.rankingPosition,
  }));
};

const saveUserToLocalStorage = (userData: AuthResponse) => {
  localStorage.setItem("accessToken", userData.accessToken);
  localStorage.setItem("refreshToken", userData.refreshToken);

  const roleMapping: Record<number, keyof typeof userData.user.additionalInfo> =
    {
      1: "idEmployee",
      2: "idEmployee",
      3: "idStudent",
      4: "idParent",
    };

  const roleKey = roleMapping[userData.user.role.id];
  if (roleKey) {
    localStorage.setItem(
      "user",
      JSON.stringify({
        id: userData.user.additionalInfo[roleKey],
        role: userData.user.role,
      })
    );
  }
};

const getAccessToken = (): string | null => {
  return localStorage.getItem("accessToken") || null;
};

const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken") || null;
};

const getUserInfo = () => {
  const userFromLocalStorage = localStorage.getItem("user");
  
  if (userFromLocalStorage) {
    try {
      return JSON.parse(userFromLocalStorage);
    } catch (e) {
      console.error("Ошибка при парсинге данных пользователя из localStorage:", e);
    }
  }
  
  return null;
};

const clearUserData = (): void => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export { 
  // api
  login, 
  loginWithJWT,
  getTopStudents,
  // api-utils
  saveUserToLocalStorage, 
  getAccessToken, 
  getRefreshToken, 
  getUserInfo, 
  clearUserData 
};
