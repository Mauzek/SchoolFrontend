const BASE_URL = "http://localhost:3000/api/v1";

const endpoints = {
    //auth
    login: `${BASE_URL}/auth/login`, // post {login, password}
    loginWithJWT: `${BASE_URL}/auth`, // post {accessToken, refreshToken}
    regUser: (role: string)=> `${BASE_URL}/auth/register?role=${role}`, // post {login, password, firstName, lastName, middleName, birthDate, phone, email, gender, documentNumber, bloodGroup}

    //users
    getStudentById: (id: string) => `${BASE_URL}/students/${id}`,
    getEmployeById: (id: string) => `${BASE_URL}/employees/${id}`,
    getParentById: (id: string) => `${BASE_URL}/parents/${id}`,
    getStudentsByParentId: (id: number) => `${BASE_URL}/students/parent/${id}`,
    getStudentsByClassId: (id: number) => `${BASE_URL}/students/class/${id}`, 
    getAllStudents: `${BASE_URL}/students/all`,
    deleteStudent: (id: number) => `${BASE_URL}/students/${id}`,
    updateStudent: (id: number) => `${BASE_URL}/students/${id}`,

    //classes
    getAllClasses: `${BASE_URL}/classes/all`,
    getClassById: (id: number) => `${BASE_URL}/classes/${id}`,
    getClassesByEmployeeId: (id: number) => `${BASE_URL}/classes/employee/${id}`,

    //grades
    getGradesByClassBySubject: (idClass: number, idSubject: number) => `${BASE_URL}/grades/class/${idClass}/subject/${idSubject}`,
    createGrade: `${BASE_URL}/grades`, // post {idStudent, idSubject, gradeValue, gradeDate, gradeType, description}
    updateGrade: (idGrade: number) => `${BASE_URL}/grades/${idGrade}`, // put {gradeValue, gradeDate, gradeType, description}
    deleteGrade: (idGrade: number) => `${BASE_URL}/grades/${idGrade}`,

    //subjects
    getSubjectById: (id: number) => `${BASE_URL}/subjects/${id}`,
    getAllSubjects: `${BASE_URL}/subjects/all`,

    //textbooks
    getTextbooksBySubjectId: (id: number) => `${BASE_URL}/textbooks/subject/${id}`,
    createTextbook: `${BASE_URL}/textbooks`, // post {idSubject, name, year, authors, isbn, textbookFile}

    //assignments
    getAssignmentById: (id: number) => `${BASE_URL}/assignments/${id}`,
    createAssignment: `${BASE_URL}/assignments`, // post {idSubject, idClass, idEmployee, title, description, fileLink, openTime, closeTime, isTesting, testingFileLink, attemptsCount}
    createTesting: `${BASE_URL}/assignments`, // post {idTesting, idStudent, answer}
    getAssignmentsBySubjectId: (id: number) => `${BASE_URL}/assignments/subject/${id}`,
    getAssignmentsBySubjectIdAndClassId: ( idSubject: number, idClass: number) => `${BASE_URL}/assignments/class/${idClass}/subject/${idSubject}`,
    
    //answers
    getAllAssignmentAnswersByAssignmentID: (id: number) => `${BASE_URL}/answers/assignment/${id}`,
    getAllTestingAnswersByTestingID: (id: number) => `${BASE_URL}/answers/testing/${id}`,
    getAnswerById: (id: number) => `${BASE_URL}/answers/${id}`,
    getStudentAssignmentAnswer: (idStudent: number, idAssignment: number) => `${BASE_URL}/answers/assignment/${idAssignment}/student/${idStudent}`,
    getStudentTestingAnswer: (idStudent: number, idTesting: number) => `${BASE_URL}/answers/testing/${idTesting}/student/${idStudent}`,
    updateAssignmentAnswer: (idAnswer: number) => `${BASE_URL}/answers/assignment/answer/${idAnswer}`, // put {grade}
    updateTestingAnswer: (idTesting: number) => `${BASE_URL}/answers/testing/answer/${idTesting}`, // put {grade}
    createAssignmentAnswer: `${BASE_URL}/answers/assignment`, // post {idAssignment, idStudent, grade, submissionDate, textAnswer ,fileLink}
    createTestingAnswer: `${BASE_URL}/answers/testing`, // post {idTesting, idStudent, grade, submissionDate, textAnswer ,fileLink}
    
    //employees
    getAllEmployees: `${BASE_URL}/employees/all`,
    deleteEmployee: (id: number) => `${BASE_URL}/employees/${id}/status`,

    //education
    createEducation: `${BASE_URL}/education`, // post {idEmployee, idEducatinLevel, idEducationalInstitution, idSpecialty, graduationYear}
    getAllEducationSettings: `${BASE_URL}/education/settings/all`,
    getEmployeeEducationByEmployeeId: (id: number) => `${BASE_URL}/education/${id}`,

    //parents
    getAllParents: `${BASE_URL}/parents/all`,
    deleteParent: (id: number) => `${BASE_URL}/parents/${id}`,

    //schedule
    getClassScheduleByWeekInterval: (id: number, startDate: string, endDate: string) => `${BASE_URL}/schedules/class/${id}/week/${startDate}/${endDate}`,
    getEmployeeScheduleByWeekInterval: (id: number, startDate: string, endDate: string) => `${BASE_URL}/schedules/employee/${id}/week/${startDate}/${endDate}`,
    createShedule: `${BASE_URL}/schedules`, // post {idClass, idSubject, idEmployee, date, weekDay, startDate, endDate, roomNumber}

    //statistics
    getTopStudents: `${BASE_URL}/statistics/top-students-by-average-grade`,
    
    //roles
    getAllRoles: `${BASE_URL}/roles/all`,
    createRole: `${BASE_URL}/roles`, // post {name}
    deleteRole: (id: number) => `${BASE_URL}/roles/${id}`,

    //updates
    updateUserAvatar: `${BASE_URL}/auth/updateAvatar`, // post {accessToken, photo}
}

export { endpoints };