import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { Welcome } from "./pages/Welcome/Welcome";
import "./App.css";
import { Auth } from "./pages/Auth/Auth";
import { Home } from "./pages/Home/Home";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Welcome />} />
          <Route path="/auth" element={<Auth/>} />
          <Route path="/home" element={<Home/>} />
          <Route path="/profile" element={<>Profile</>}/>
        </Route>
      </Routes>
  );
}

export default App;