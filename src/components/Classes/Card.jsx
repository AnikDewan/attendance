import { useState, useEffect } from "react";
import ClickOutside from "../ClickOutside.jsx";
import ClassModal from "./ClassModal.jsx";
import Alert from "../Alert/Alert.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsisV,
  faEdit,
  faTrash,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import "./Card.css";
const URL = import.meta.env.VITE_API_URL;

const Card = ({ classid, name, access, setRefresh, theme, handleClick }) => {
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [type, setType] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const token = localStorage.getItem("auth-token");

  const handleEdit = () => {
    setEditModal(true);
    setPopupOpen(false);
  };

  const handleDelete = async () => {
    setPopupOpen(false);
    setType("delete");
    setOpenAlert(true);
  };

  const deleteClass = async () => {
    try {
      const response = await fetch(`${URL}deleteclass/${classid}`, {
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
      deleteClass();
    }
  }, [confirmed]);

  useEffect(() => {
    if (!openAlert && type==="success") {
      setRefresh((prevState) => !prevState);
    }
  }, [openAlert]);

  return (
    <div
      className="card"
      style={
        theme
          ? { background: "rgba( 0, 0, 0, 0.3 )", border: "1px solid #f5f5f5" }
          : {
              background: "rgba( 255, 255, 255, 0.3 )",
              border: "1px solid #1a1a1a",
            }
      }
    >
      <div className="profile-section" onClick={handleClick}>
        <div
          className="profile-icon"
          style={
            theme
              ? { backgroundColor: "#1a1a1a" }
              : { backgroundColor: "#f5f5f5" }
          }
        >
          <FontAwesomeIcon icon={faUserGroup} />
        </div>
        <div className="name">{name}</div>
      </div>
      <div
        className="options-section"
        onClick={() => setPopupOpen(true)}
      >
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
        <ClassModal
          type="edit"
          setClassModalOpen={setEditModal}
          name={name}
          access={access}
          setRefresh={setRefresh}
          theme={theme}
          classid={classid}
        />
      )}
    </div>
  );
};

export default Card;
