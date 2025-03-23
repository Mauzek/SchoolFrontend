import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Welcome } from "./pages/Welcome/Welcome";
import "./App.css";
import { Auth } from "./pages/Auth/Auth";
import { Home } from "./pages/Home/Home";
import { Profile } from "./pages/Profile/[id]/Profile";
import { Schedule } from "./pages/Schedule/Schedule";
import { Subject } from "./pages/Subject/[id]/Subject";
import { Subjects } from "./pages/Subject/Subjects";
import { AdminRoute } from "./components/AdminRoute/AdminRoute";
import { CreateSchedule } from "./pages/CreateSchedule/CreateSchedule";
import { Assignment } from "./pages/Assignments/Assignment";
import { CreateAssignment } from "./pages/CreateAssignment/CreateAssignment";
import { CreateTextbook } from "./pages/CreateTextbook/CreateTextbook";
import { Grades } from "./pages/Grades/Grades";
import { Students } from "./pages/MyStudents/Students";
import { AllStudents } from "./pages/Students/AllStudents";
import { Parents } from "./pages/Parents/Parents";
import { Employees } from "./pages/Employees/Employees";
import { Roles } from "./pages/Roles/Roles";
import { Positions } from "./pages/Positions/Positions";
import { Classes } from "./pages/Classes/Classes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="/auth" element={<Auth/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/profile/:id" element={<Profile/>}/>
        <Route path="/schedule" element={<Schedule/>} />
        
        {/* Защищенные маршруты для администраторов */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/schedule/create-schedule" element={<CreateSchedule/>}/>
          <Route path="/students" element={<AllStudents/>}/>
          <Route path="/parents" element={<Parents/>}/>"
          <Route path="/employees" element={<Employees/>}/>
          <Route path="/roles" element={<Roles/>}/>
          <Route path="/positions" element={<Positions/>}/>
          <Route path="/classes" element={<Classes/>}/>
          {/* Другие маршруты, доступные только администраторам */}
        </Route>
        <Route path="/my-students" element={<Students/>}/>
        <Route path="/grades" element={<Grades/>}/>
        <Route path="/assignment/:id" element={<Assignment/>}/>
        <Route path="/subjects" element={<Subjects/>}/>
        <Route path="/subject/:id" element={<Subject/>}/>
        <Route path="/subject/:id/add-textbook" element={<CreateTextbook/>}/>
        <Route path="/subject/:id/create-assignment" element={<CreateAssignment/>}/>
      </Route>
    </Routes>
  );
}

export default App;
