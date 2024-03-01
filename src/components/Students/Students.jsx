import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ClickOutside from "../ClickOutside.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faListCheck,
  faPlus,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";
import StudentCard from "./StudentCard";
import StudentModal from "./StudentModal";
import Alert from "../Alert/Alert.jsx";
import Loader from "../Loader/Loader";
import "./Students.css";

import FileModal from "./FileModal";
const URL = import.meta.env.VITE_API_URL;

const Students = () => {
  const [data, setData] = useState([]);
  const [attSheet, setAttSheet] = useState({});
  const [tabOpen, setTabOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [type, setType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [takingAttendance, setTakingAttendance] = useState(false);
  const token = localStorage.getItem("auth-token");

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const { classid } = useParams();
  const [mode, setMode] = useState(localStorage.getItem("theme") === "true");
  window.addEventListener("storage", () =>
    setMode(localStorage.getItem("theme") === "true"),
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${URL}getstudents/${classid}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
        const result = await response.json();
        result.sort((a, b) => {
          return a.roll - b.roll;
        });
        if (result.error) {
          setType("error");
          setOpenAlert(true);
          setAlertMessage(result.error);
        } else {
          setData(result);
        }
      } catch (error) {
        setType("error");
        setOpenAlert(true);
      }
      setLoading(false);
    };

    fetchData();
  }, [refresh]);

  const takeAttendance = async () => {
    console.log(attSheet);
    console.log(token);
    try {
      const response = await fetch(`${URL}takeattendance/`, {
        method: "PUT",
        body: JSON.stringify(attSheet),
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const result = await response.json();
      if (result.error) {
        setType("error");
        setOpenAlert(true);
        setAlertMessage(result.error);
      } else {
        setType("success");
        setRefresh((prevState) => !prevState);
      }
    } catch (error) {
      setType("error");
    }
    setLoading(false);
    setOpenAlert(true);
    setTakingAttendance(false);
  };

  const addManyStudents = () => {
    setModalVisible(true);
    setPopupOpen(false);
  };

  return (
    <div>
      <div className={`heading-title ${mode ? "dark" : "light"}`}>
        <strong>Students</strong>
        <FontAwesomeIcon
          icon={faEllipsisV}
          className="three-dots-icon"
          onClick={() => setPopupOpen(true)}
        />
      </div>
      {isPopupOpen && (
        <div
          className="popup"
          style={
            mode
              ? { backgroundColor: "#1a1a1a", border: "1px solid #ddd" }
              : { backgroundColor: "#f5f5f5", border: "1px solid #000" }
          }
        >
          <ClickOutside onClick={() => setPopupOpen(false)}>
            <div
              className="popup-option"
              onClick={() => {
                setTakingAttendance((prev) => !prev);
                setPopupOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faListCheck} className="popup-icon" />
              <span className="popup-option-name">Take attendance</span>
            </div>
            <div className="popup-option" onClick={addManyStudents}>
              <FontAwesomeIcon icon={faPlus} className="popup-icon" />
              <span className="popup-option-name">Add many students</span>
            </div>
            <div
              className="popup-option"
              onClick={() => {
                setTabOpen(true);
                setPopupOpen(false);
              }}
            >
              <FontAwesomeIcon icon={faPlus} className="popup-icon" />
              <span className="popup-option-name">Add student</span>
            </div>
          </ClickOutside>
        </div>
      )}

      {tabOpen && (
        <StudentModal
          type="add"
          setStudentModalOpen={setTabOpen}
          classid={classid}
          setRefresh={setRefresh}
          theme={mode}
        />
      )}

      {openAlert && (
        <Alert
          type={type}
          setOpenAlert={setOpenAlert}
          message={alertMessage}
          theme={mode}
        />
      )}

      {modalVisible && (
        <FileModal
          setModalVisible={setModalVisible}
          setRefresh={setRefresh}
          classid={classid}
          theme={mode}
        />
      )}

      {loading && <Loader />}

      {data.length === 0 && !loading && (
        <div className="no-content">
          <FontAwesomeIcon
            icon={faCirclePlus}
            className="no-content-icon"
            onClick={addManyStudents}
          />
          <h1>No students found</h1>
        </div>
      )}

      <div className="student-cards">
        {data.map((student) => (
          <StudentCard
            key={student._id}
            student={student}
            theme={mode}
            setRefresh={setRefresh}
            takingAttendance={takingAttendance}
            setAttSheet={setAttSheet}
          />
        ))}
      </div>
      {takingAttendance && (
        <div className="submit-btn" onClick={takeAttendance}>
          Submit
        </div>
      )}
    </div>
  );
};

export default Students;
