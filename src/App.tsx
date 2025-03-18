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

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/schedule" element={<Schedule/>}/>
          <Route path="/subjects" element={<Subjects/>}/>
          <Route path="/subject/:id" element={<Subject/>}/>
        </Route>
      </Routes>
  );
}

export default App;