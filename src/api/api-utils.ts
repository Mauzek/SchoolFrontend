import axios from "axios";
import { endpoints } from "./config";
import { ApiAuthResponse, AuthResponse  } from "../types";

const axiosRequest = async (
  method: 'get' | 'post' | 'put' | 'delete',
  url: string,
  token?: string,
  data?: any
) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await axios({ method, url, headers, data });
    return response.data;
  } catch (error) {
    console.error("Ошибка при выполнении запроса:", error);
    throw error;
  }
};

const login = async (login: string, password: string): Promise<AuthResponse> => {
  const response = await axiosRequest('post', endpoints.login, undefined, { login, password });
  return normalizeAuthResponse(response);
};

const normalizeAuthResponse = (data: ApiAuthResponse): AuthResponse => {
  return {
    message: data.message,
    user: {
      id: data.user.id,
      email: data.user.email,
      role: {
        idRole: data.user.role.idRole,
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

export { login };