const BASE_URL = "http://localhost:3000/api/v1";

const endpoints = {
    //auth
    login: `${BASE_URL}/auth/login`, // post {login, password}
    loginWithJWT: `${BASE_URL}/auth`, // post {accessToken, refreshToken}

    //statistics
    getTopStudents: `${BASE_URL}/statistics/top-students-by-average-grade`,
    
}

export { endpoints };