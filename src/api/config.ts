const BASE_URL = "http://localhost:3000/api/v1";

const endpoints = {
    login: `${BASE_URL}/auth/login`, // post {login, password}
    loginWithJWT: `${BASE_URL}/auth`, // post {accessToken, refreshToken}
}

export { endpoints };