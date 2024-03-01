import { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Hamburger from "../Hamburger/Hamburger";
import Menu from "../Menu/Menu";
import title from "./title.png";
import ClickOutside from "../ClickOutside.jsx";
import "./Home.css";
const URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState({});
  const [hamSelect, setHamSelect] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem("theme") === "true");

  const getTeacher = async () => {
    const response = await fetch(`${URL}getteacher/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": token,
      },
    });
    const result = await response.json();
    if (result.error) {
      navigate("/login");
    } else {
      setTeacher(result);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      getTeacher();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", mode);
    window.dispatchEvent(new Event("storage"));
  }, [mode]);

  return (
    <div className={mode ? "home-dark" : "home-light"}>
      <ClickOutside onClick={() => setHamSelect(false)}>
        <nav className={mode ? "dark" : "light"}>
          <img src={title} alt="ATTENDANCE" className="title" />
          <Hamburger state={hamSelect} setState={setHamSelect} theme={mode} />
          <Menu
            name={teacher.name}
            state={hamSelect}
            theme={mode}
            toggle={setMode}
          />
        </nav>
      </ClickOutside>
      <Outlet />
    </div>
  );
};
export default Home;
