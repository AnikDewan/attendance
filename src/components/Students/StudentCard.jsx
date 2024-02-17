import { useState, useEffect } from "react";
import ClickOutside from "../ClickOutside.jsx";
import StudentModal from "./StudentModal.jsx";
import Alert from "../Alert/Alert.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import "./StudentCard.css";

const URL = import.meta.env.VITE_API_URL;

const Card = ({
  student,
  theme,
  setRefresh,
  takingAttendance,
  setAttSheet,
}) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [type, setType] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const token = localStorage.getItem("auth-token");

  const { _id, name, presence, roll } = student;

  const handleEdit = () => {
    setEditModal(true);
    setPopupOpen(false);
  };

  const handleDelete = () => {
    setPopupOpen(false);
    setType("delete");
    setOpenAlert(true);
  };

  const presencePercent = (pr) => {
    if (pr.length === 0) {
      return 0;
    } else {
      let count = pr.split("p").length - 1;
      let pp = (count / pr.length) * 100;
      return pp.toFixed(2);
    }
  };

  const deleteStudent = async () => {
    try {
      const response = await fetch(`${URL}deletestudent/${_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const result = await response.json();
      if (result.error) {
        setType("error");
        setAlertMessage(result.error);
      } else {
        setType("success");
        setAlertMessage(result.success);
      }
    } catch (err) {
      console.error(err);
      setType("error");
    }
    setOpenAlert(true);
    setConfirmed(false);
  };

  useEffect(() => {
    if (confirmed) {
      deleteStudent();
    }
  }, [confirmed]);

  useEffect(() => {
    if (!openAlert && type==="success") {
      setRefresh((prevState) => !prevState);
    }
  }, [openAlert]);

  useEffect(() => {
    setAttSheet((prev) => {
      return { ...prev, [_id]: present ? "p" : "a" };
    });
  }, [present]);

  return (
    <div>
      <div
        className="card"
        style={
          theme
            ? {
                background: "rgba( 0, 0, 0, 0.3 )",
                border: "1px solid #f5f5f5",
              }
            : {
                background: "rgba( 255, 255, 255, 0.3 )",
                border: "1px solid #1a1a1a",
              }
        }
      >
        <div className="profile-section">
          <div
            className="profile-icon"
            style={
              theme
                ? { backgroundColor: "#1a1a1a" }
                : { backgroundColor: "#f5f5f5" }
            }
          >
            <strong>{roll}</strong>
          </div>
          <div className="profile-info">
            <strong className="name">{name}</strong>
            <div>
              presence: {presencePercent(presence)}
              {"%"}
            </div>
          </div>
        </div>
        <div className="options-section" onClick={() => setPopupOpen(true)}>
          <FontAwesomeIcon icon={faEllipsisV} className="three-dots-icon" />
        </div>
        {isPopupOpen && (
          <div
            className="popup"
            style={
              theme
                ? { backgroundColor: "#1a1a1a", border: "1px solid #ddd" }
                : { backgroundColor: "#f5f5f5", border: "1px solid #000" }
            }
          >
            <ClickOutside onClick={() => setPopupOpen(false)}>
              <div className="popup-option" onClick={handleEdit}>
                <FontAwesomeIcon icon={faEdit} className="popup-icon" />
                <span className="popup-option-name">Edit</span>
              </div>
              <div className="popup-option" id="delete" onClick={handleDelete}>
                <FontAwesomeIcon icon={faTrash} className="popup-icon" />
                <span className="popup-option-name">Delete</span>
              </div>
            </ClickOutside>
          </div>
        )}

        {openAlert && (
          <Alert
            type={type}
            setOpenAlert={setOpenAlert}
            message={alertMessage}
            setConfirmed={setConfirmed}
            theme={theme}
          />
        )}

        {editModal && (
          <StudentModal
            type="edit"
						setStudentModalOpen={setEditModal}
            name={name}
            roll={roll}
            setRefresh={setRefresh}
            theme={theme}
            studentid={_id}
          />
        )}
      </div>
      {takingAttendance && (
        <div
          className="taking-attendance"
          onClick={() => setPresent((prev) => !prev)}
          style={
            present
              ? { backgroundColor: "rgba( 0,255,0,0.5 )" }
              : { backgroundColor: "rgba( 128,128,128,0.5 )" }
          }
        >
          <strong>{present ? "Present" : "Absent"}</strong>
        </div>
      )}
    </div>
  );
};

export default Card;
