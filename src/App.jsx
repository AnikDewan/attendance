import "./App.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import Home from "./components/Home/Home.jsx";
import Login from "./components/Login/Login.jsx";
import Classes from "./components/Classes/Classes.jsx";
import Students from "./components/Students/Students.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />}>
        <Route index element={<Classes />} />
        <Route path="students/:classid" element={<Students />} />
      </Route>
      <Route path="/login" element={<Login />} />
    </>,
  ),
);
export default router;
