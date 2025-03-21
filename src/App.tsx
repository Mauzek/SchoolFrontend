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
          {/* Другие маршруты, доступные только администраторам */}
        </Route>

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
