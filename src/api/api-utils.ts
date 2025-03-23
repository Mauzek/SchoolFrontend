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
  ScheduleDetailsRessponse,
  ApiChildrensResponse,
  ApiAllClassesResponse,
  ApiAllSubjectsResponse,
  ApiCreateSchedule,
  ApiEmployeeDetails,
  ApiTextbooksResponse,
  ApiAssignmentsResponse,
  ApiAssignmentResponse,
  ApiSubjectResponse,
  ApiGradesResponse,
  ApiCreateGrade,
  ApiUpdateGrade,
  ApiClassResponse,
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

const registrationUser = (data: FormData, role: string, token: string) => {
  const response = axiosRequest("post", endpoints.regUser(role), token, data);
  return response;
}

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

const getClassScheduleByWeekInterval = async (
  id: number,
  startDate: string,
  endDate: string,
  token: string
): Promise<ScheduleDetailsRessponse> => {
  const response = await axiosRequest(
    "get",
    endpoints.getClassScheduleByWeekInterval(id, startDate, endDate),
    token
  );
  return response;
};

const getEmployeeScheduleByWeekInterval = async (
  id: number,
  startDate: string,
  endDate: string,
  token: string
): Promise<ScheduleDetailsRessponse> => {
  const response = await axiosRequest(
    "get",
    endpoints.getEmployeeScheduleByWeekInterval(id, startDate, endDate),
    token
  );
  return response;
};

const getStudentsByParentId = async (id: number, token: string): Promise<ApiChildrensResponse[]> => {
  const response = await axiosRequest("get", endpoints.getStudentsByParentId(id), token);
  return response;
};

const getAllClasses = async (token: string): Promise<ApiAllClassesResponse> => {
  const response = await axiosRequest("get", endpoints.getAllClasses, token);
  return response;
}

const getClassById = async (id: number, token: string): Promise<ApiClassResponse> => {
  const response = await axiosRequest("get", endpoints.getClassById(id), token);
  return response;
}

const getStudentsByClassId = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getStudentsByClassId(id), token);
  return response;
}

const getAllStudents = async (token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllStudents, token);
  return response;
}

const deleteStudentById = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("delete", endpoints.deleteStudent(id), token);
  return response;
}

const getAllParents = async (token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllParents, token);
  return response;
}

const deleteParentById = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("delete", endpoints.deleteParent(id), token);
  return response;
}

const getClassesByEmployeeId = async (id: number, token: string): Promise<ApiAllClassesResponse> => {
  const response = await axiosRequest("get", endpoints.getClassesByEmployeeId(id), token);
  return response;
}

const getGradesByClassBySubject = async (id: number, subjectId: number, token: string): Promise<ApiGradesResponse> => {
  const response = await axiosRequest("get", endpoints.getGradesByClassBySubject(id, subjectId), token);
  return response;
}

const createGrade =  async (data: ApiCreateGrade, token: string) => {
  const response = await axiosRequest("post", endpoints.createGrade, token, data);
  return response;
}

const updateGrade = async (idGrade: number, data: ApiUpdateGrade, token: string) => {
  const response = await axiosRequest("put", endpoints.updateGrade(idGrade), token, data);
  return response;
}

const deleteGrade = async (idGrade: number, token: string) => {
  const response = await axiosRequest("delete", endpoints.deleteGrade(idGrade), token);
  return response;
}

const getAllSubjects = async (token: string): Promise<ApiAllSubjectsResponse> => {
  const response = await axiosRequest("get", endpoints.getAllSubjects, token);
  console.log("getAllSubjects Response:", response);
  return response;
}

const getAllEmployees = async (token: string): Promise<ApiEmployeeDetails[]> => {
  const response = await axiosRequest("get", endpoints.getAllEmployees, token);
  return response;
}

const deleteEmployeeById = async (id: number, token: string) => {
  const response = await axiosRequest("put", endpoints.deleteEmployee(id), token);
  return response;
}

const createEducation = async (data: any, token: string) => {
  const response = await axiosRequest("post", endpoints.createEducation, token, data);
  return response;
}

const getAllEducationSettings = async (token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllEducationSettings, token);
  return response;
}

const getEmployeeEducationByEmployeeId = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getEmployeeEducationByEmployeeId(id), token);
  return response;
}

const getAllRoles = async (token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllRoles, token);
  return response;
}

const createRole = async (data: any, token: string) => {
  const response = await axiosRequest("post", endpoints.createRole, token, data);
  return response;
}

const deleteRoleById = async (id: number, token: string) => {
  const response = await axiosRequest("delete", endpoints.deleteRole(id), token);
  return response;
}

const getAllPositions = async (token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllPositions, token);
  return response;
}

const createPosition = async (data: any, token: string) => {
  const response = await axiosRequest("post", endpoints.createPosition, token, data);
  return response;
}

const deletePositionById = async (id: number, token: string) => {
  const response = await axiosRequest("delete", endpoints.deletePosition(id), token);
  return response;
}

const createScheduleItem = async (data: ApiCreateSchedule, token: string) => {
  const response = await axiosRequest("post", endpoints.createShedule, token, data);
  return response;
}

const getSubjectById = async (id: number, token: string): Promise<ApiSubjectResponse> => {
  const response = await axiosRequest("get", endpoints.getSubjectById(id), token);
  return response;
}

const getTextbooksBySubjectId = async (id: number, token: string): Promise<ApiTextbooksResponse> => {
  const response = await axiosRequest("get", endpoints.getTextbooksBySubjectId(id), token);
  return response;
}

const createTextbook = async (data: FormData, token: string) => {
  const response = await axiosRequest("post", endpoints.createTextbook, token, data);
  return response;
}

const getAssignmentById = async (id: number, token: string): Promise<ApiAssignmentResponse> => {
  const response = await axiosRequest("get", endpoints.getAssignmentById(id), token);
  return response;
}

const getAssignmentsBySubjectId = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAssignmentsBySubjectId(id), token);
  return response;
}

const getAssignmentsBySubjectIdAndClassId = async (subjectId: number, classId: number, token: string): Promise<ApiAssignmentsResponse> => {
  const response = await axiosRequest("get", endpoints.getAssignmentsBySubjectIdAndClassId(subjectId, classId), token);
  return response;
}

const getAllAssignmentAnswersByAssignmentID = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllAssignmentAnswersByAssignmentID(id), token);
  return response;
}

const getAllTestingAnswersByTestingID = async (id: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getAllTestingAnswersByTestingID(id), token);
  return response;
}

const getStudentAssignmentAnswer = async (studentId: number, assignmentId: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getStudentAssignmentAnswer(studentId, assignmentId), token);
  return response;
}

const getStudentTestingAnswer = async (studentId: number, testingId: number, token: string): Promise<any> => {
  const response = await axiosRequest("get", endpoints.getStudentTestingAnswer(studentId, testingId), token);
  return response;
}

const updateAssignmentAnswer = async (grade: number, idAnswer: number, token: string) => {
  const response = await axiosRequest("put", endpoints.updateAssignmentAnswer(idAnswer), token, {grade: grade});
  return response;
}

const updateTestingAnswer = async (grade: number, idAnswer: number, token: string) => {
  const response = await axiosRequest("put", endpoints.updateTestingAnswer(idAnswer), token, {grade: grade});
  return response;
}

const createAssignmentAnswer = async (data: FormData, token: string) => {
  const response = await axiosRequest("post", endpoints.createAssignmentAnswer, token, data);
  return response;
}

const createTestingAnswer = async (data: FormData, token: string) => {
  const response = await axiosRequest("post", endpoints.createTestingAnswer, token, data);
  return response;
}

const createAssignment = async (data: FormData, token: string) => {
  const response = await axiosRequest("post", endpoints.createAssignment, token, data);
  return response;
}

const createTesting = async (data: FormData, token: string) => {
  const response = await axiosRequest("post", endpoints.createTesting, token, data);
  return response;
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
      type: parent.type,
      firstName: parent.firstName,
      lastName: parent.lastName,
      middleName: parent.middleName,
      photo: parent.photo,
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
  registrationUser,
  getTopStudents,
  getStudentById,
  getEmployeeById,
  getParentById,
  updateAvatar,
  getClassScheduleByWeekInterval,
  getEmployeeScheduleByWeekInterval,
  getStudentsByParentId,
  getAllStudents,
  deleteStudentById,
  getAllClasses,
  getClassById,
  getStudentsByClassId,
  getClassesByEmployeeId,
  getGradesByClassBySubject,
  createGrade,
  updateGrade,
  deleteGrade,
  getAllRoles,
  createRole,
  deleteRoleById,
  getAllSubjects,
  getAllEmployees,
  getEmployeeEducationByEmployeeId,
  deleteEmployeeById,
  createEducation,
  getAllEducationSettings,
  createScheduleItem,
  getSubjectById,
  getTextbooksBySubjectId,
  getAssignmentById,
  getAssignmentsBySubjectId,
  getAssignmentsBySubjectIdAndClassId,
  getAllAssignmentAnswersByAssignmentID,
  getStudentAssignmentAnswer,
  getStudentTestingAnswer,
  createAssignmentAnswer,
  createTestingAnswer,
  updateAssignmentAnswer,
  updateTestingAnswer,
  createAssignment,
  createTesting,
  getAllTestingAnswersByTestingID,
  createTextbook,
  getAllParents,
  deleteParentById,
  getAllPositions,
  createPosition,
  deletePositionById,
  // api-utils
  saveUserToLocalStorage,
  getAccessToken,
  getRefreshToken,
  getUserInfo,
  clearUserData,
};
