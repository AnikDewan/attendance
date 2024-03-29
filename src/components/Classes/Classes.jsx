import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import ClassModal from "./ClassModal";
import Alert from "../Alert/Alert.jsx";
import Loader from "../Loader/Loader";
const URL = import.meta.env.VITE_API_URL;
import Card from "./Card";

const Classes = () => {
  const [data, setData] = useState([]);
  const [tabOpen, setTabOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("auth-token");
  const navigate = useNavigate();
  const [mode, setMode] = useState(localStorage.getItem("theme") === "true");
  window.addEventListener("storage", () =>
    setMode(localStorage.getItem("theme") === "true"),
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}getclasses/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const result = await response.json();
        if (result.error) {
          setOpenAlert(true);
          setAlertMessage(result.error);
        } else {
          setData(result);
        }
      } catch (error) {
        setOpenAlert(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [refresh]);

  const handleClick = (id) => {
    navigate(`/students/${id}`);
  };

  return (
    <>
      <div className={`heading-title ${mode ? "dark" : "light"}`}>
        <strong>Classes</strong>
        <FontAwesomeIcon
          icon={faPlus}
          onClick={() => setTabOpen(true)}
          className="three-dots-icon"
        />
        {tabOpen && (
          <ClassModal
            type="add"
            setClassModalOpen={setTabOpen}
            setRefresh={setRefresh}
            theme={mode}
          />
        )}

        {openAlert && (
          <Alert
            type="error"
            setOpenAlert={setOpenAlert}
            message={alertMessage}
            theme={mode}
          />
        )}
      </div>
      <div>
        {loading && <Loader />}

        {data.length === 0 && !loading && (
          <div className="no-content">
            <FontAwesomeIcon
              icon={faCirclePlus}
              className="no-content-icon"
              onClick={() => setTabOpen(true)}
            />
            <h1>No classes found</h1>
          </div>
        )}

        {data.map((item) => (
          <Card
            key={item._id}
            classid={item._id}
            name={item.name}
            access={item.access}
            setRefresh={setRefresh}
            theme={mode}
            handleClick={() => handleClick(item._id)}
          />
        ))}
      </div>
    </>
  );
};

export default Classes;
