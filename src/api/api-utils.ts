import axios from "axios";
import { endpoints } from "./config";
import {
  ApiAuthResponse,
  ApiTopStudent,
  ApiTopStudentsResponse,
  AuthResponse,
  StudentDetails,
  TopStudent,
  ApiParent,
  ApiStudentDetails,
  ApiEmployeeDetailsResponse,
  EmployeeDetails,
  ApiChildren,
  ParentDetails,
  ApiParentDetailsResponse,
  updateAvatarDetails,
  ApiUpdateAvatarResponse,
} from "../types";

// Запросы к API
const login = async (
  login: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axiosRequest("post", endpoints.login, undefined, {
    login,
    password,
  });
  return normalizeAuthResponse(response);
};

const loginWithJWT = async (
  accessToken: string,
  refreshToken: string
): Promise<AuthResponse> => {
  const response = await axiosRequest(
    "post",
    endpoints.loginWithJWT,
    undefined,
    {
      accessToken,
      refreshToken,
    }
  );
  return normalizeAuthResponse(response);
};

const getTopStudents = async (token: string): Promise<TopStudent[]> => {
  const response = await axiosRequest("get", endpoints.getTopStudents, token);
  return normalizeTopStudentsResponse(response);
};

const getStudentById = async (id: string, token: string): Promise<StudentDetails> => {
  const response = await axiosRequest("get", endpoints.getStudentById(id), token);
  console.log("API Response:", response); 
  return normalizeStudentDetailsResponse(response);
};

const getEmployeeById = async (id: string, token: string): Promise<EmployeeDetails> => {
  const response = await axiosRequest("get", endpoints.getEmployeById(id), token);
  console.log("API Response:", response);
  return normalizeEmployeeDetailsResponse(response);
};

const getParentById = async (id: string, token: string): Promise<ParentDetails> => {
  const response = await axiosRequest("get", endpoints.getParentById(id), token);
  return normalizeParentResponse(response);
};

const updateAvatar = async (token: string, photo: File): Promise<updateAvatarDetails> => {
  const formData = new FormData();
  formData.append("accessToken", token);
  formData.append("photo", photo);
  const response = await axiosRequest("post", endpoints.updateUserAvatar, token, formData);
  return normalizeAvatarResponse(response);
}

// Api-utils
const axiosRequest = async (
  method: "get" | "post" | "put" | "delete",
  url: string,
  token?: string,
  data?: any,
  options?: any
) => {
  try {
    const isFormData = data instanceof FormData;
  
    const headers: Record<string, string> = {
      ...(!isFormData && { "Content-Type": "application/json" }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options?.headers || {})
    };

    const config = {
      method,
      url,
      headers,
      data,
      ...options
    };

    console.log("Request config:", {
      method,
      url,
      isFormData,
      tokenProvided: !!token
    });

    const response = await axios(config);
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
        id: data.user.role.id,
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

const normalizeTopStudentsResponse = (
  data: ApiTopStudentsResponse
): TopStudent[] => {
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
    role: {
      id: student.role.id,
      name: student.role.name,
    }
  }));
};

const normalizeStudentDetailsResponse = (
  data: ApiStudentDetails
): StudentDetails => {
  const { student, class: studentClass, parents, distribution } = data;

  return {
    student: {
      id: student.idStudent,
      firstName: student.firstName,
      lastName: student.lastName,
      middleName: student.middleName,
      phone: student.phone,
      birthDate: student.birthDate,
      login: student.login,
      email: student.email,
      gender: student.gender,
      photo: student.photo,
      documentNumber: student.documentNumber,
      bloodGroup: student.bloodGroup,
    },
    class: {
      id: studentClass.idClass,
      number: studentClass.classNumber,
      letter: studentClass.classLetter,
    },
    parents: parents.map((parent: ApiParent) => ({
      id: parent.idParent,
      firstName: parent.firstName,
      lastName: parent.lastName,
      middleName: parent.middleName,
    })),
    distribution,
  };
};

const normalizeEmployeeDetailsResponse = (data: ApiEmployeeDetailsResponse): EmployeeDetails => {
  try {
    // Try to access the data in different possible structures
    const responseData = data.data || data;
    
    return {
      id: responseData.idEmployee,
      userId: responseData.idUser,
      login: responseData.login,
      email: responseData.email,
      firstName: responseData.firstName,
      lastName: responseData.lastName,
      middleName: responseData.middleName,
      gender: responseData.gender,
      photo: responseData.photo,
      position: {
        id: responseData.position.idPosition,
        name: responseData.position.name
      },
      role: {
        name: responseData.role.name
      },
      maritalStatus: responseData.maritalStatus,
      birthDate: responseData.birthDate,
      phone: responseData.phone,
      isStaff: responseData.isStaff,
      passportSeries: responseData.passportSeries,
      passportNumber: responseData.passportNumber,
      workBookNumber: responseData.workBookNumber,
      registrationAddress: responseData.registrationAddress,
      workExperience: responseData.workExperience,
      hireDate: responseData.hireDate
    };
  } catch (error) {
    console.error("Error normalizing employee details:", error);
    console.error("Response data:", data);
    throw new Error("Failed to process employee data");
  }
};

const normalizeParentResponse = (data: ApiParentDetailsResponse): ParentDetails => {
  return {
    id: data.id,
    idUser: data.idUser,
    login: data.login,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    middleName: data.middleName,
    gender: data.gender,
    photo: data.photo,
    role: {
      id: data.role.id,
      name: data.role.name
    },
    parentType: data.parentType,
    phone: data.phone,
    workPhone: data.workPhone,
    workplace: data.workplace,
    position: data.position,
    childrenCount: data.childrenCount,
    passportSeries: data.passportSeries,
    passportNumber: data.passportNumber,
    registrationAddress: data.registrationAddress,
    children: data.children.map((child: ApiChildren) => ({
      id: child.id,
      firstName: child.firstName,
      lastName: child.lastName,
      middleName: child.middleName,
      class: {
        id: child.class.idClass,
        number: child.class.classNumber,
        letter: child.class.classLetter
      },
      photo: child.photo,
      role: {
        id: child.role.id,
        name: child.role.name
      }
    }))
  };
};

const normalizeAvatarResponse = (data: ApiUpdateAvatarResponse): updateAvatarDetails => {
  return {
    message: data.message,
    photo: data.photo
  };
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
      console.error(
        "Ошибка при парсинге данных пользователя из localStorage:",
        e
      );
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
  getStudentById,
  getEmployeeById,
  getParentById,
  updateAvatar,

  // api-utils
  saveUserToLocalStorage,
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  clearUserData,
};
