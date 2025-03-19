const BASE_URL = "http://localhost:3000/api/v1";

const endpoints = {
    //auth
    login: `${BASE_URL}/auth/login`, // post {login, password}
    loginWithJWT: `${BASE_URL}/auth`, // post {accessToken, refreshToken}

    //users
    getStudentById: (id: string) => `${BASE_URL}/students/${id}`,
    getEmployeById: (id: string) => `${BASE_URL}/employees/${id}`,
    getParentById: (id: string) => `${BASE_URL}/parents/${id}`,
    getStudentsByParentId: (id: number) => `${BASE_URL}/students/parent/${id}`,

    //classes
    getAllClasses: `${BASE_URL}/classes/all`,

    //subjects
    getSubjectById: (id: number) => `${BASE_URL}/subjects/${id}`,
    getAllSubjects: `${BASE_URL}/subjects/all`,

    //textbooks
    getTextbooksBySubjectId: (id: number) => `${BASE_URL}/textbooks/subject/${id}`,

    //assignments
    getAssignmentById: (id: number) => `${BASE_URL}/assignments/${id}`,
    getAssignmentsBySubjectId: (id: number) => `${BASE_URL}/assignments/subject/${id}`,
    getAssignmentsBySubjectIdAndClassId: ( idSubject: number, idClass: number) => `${BASE_URL}/assignments/class/${idClass}/subject/${idSubject}`,
    
    //answers
    getAllAssignmentAnswersByAssignmentID: (id: number) => `${BASE_URL}/answers/assignment/${id}`,
    getAllTestingAnswersByTestingID: (id: number) => `${BASE_URL}/answers/testing/${id}`,
    getAnswerById: (id: number) => `${BASE_URL}/answers/${id}`,
    getStudentAssignmentAnswers: (idStudent: number, idAssignment: number) => `${BASE_URL}/answers/assignment/${idAssignment}/student/${idStudent}`,
    getStudentTestingAnswers: (idStudent: number, idTesting: number) => `${BASE_URL}/answers/testing/${idTesting}/student/${idStudent}`,

    //employees
    getAllEmployees: `${BASE_URL}/employees/all`,

    //schedule
    getClassScheduleByWeekInterval: (id: number, startDate: string, endDate: string) => `${BASE_URL}/schedules/class/${id}/week/${startDate}/${endDate}`,
    getEmployeeScheduleByWeekInterval: (id: number, startDate: string, endDate: string) => `${BASE_URL}/schedules/employee/${id}/week/${startDate}/${endDate}`,
    createShedule: `${BASE_URL}/schedules`, // post {idClass, idSubject, idEmployee, date, weekDay, startDate, endDate, roomNumber}

    //statistics
    getTopStudents: `${BASE_URL}/statistics/top-students-by-average-grade`,
    
    //updates
    updateUserAvatar: `${BASE_URL}/auth/updateAvatar`, // post {accessToken, photo}
}

export { endpoints };