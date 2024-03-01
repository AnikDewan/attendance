import { useState, useEffect } from "react";
import ClickOutside from "..//ClickOutside";
import Alert from "../Alert/Alert.jsx";
import "./ClassModal.css";
const URL = import.meta.env.VITE_API_URL;

const ClassModal = ({
  type,
  setClassModalOpen,
  name,
  access,
  setRefresh,
  theme,
  classid,
}) => {
  const [newName, setNewName] = useState(name || "");
  const [newAccess, setNewAccess] = useState(access === "only me");
  const [alertType, setAlertType] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const token = localStorage.getItem("auth-token");
  const url = `${URL}${type === "add" ? "addclass" : "updateclass"}/${
    classid ? classid : ""
  }`;

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: `${type === "add" ? "POST" : "PUT"}`,
        body: JSON.stringify({ name: newName, access: newAccess }),
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const result = await response.json();
      if (result.error) {
        setAlertType("error");
        setAlertMessage(result.error);
      } else {
        setAlertType("success");
        setAlertMessage(result.success);
      }
    } catch (err) {
      setAlertType("error");
    }
    setOpenAlert(true);
  };

  useEffect(() => {
    if (!openAlert && alertType !== "") {
      setClassModalOpen(false);
      setRefresh((prevState) => !prevState);
    }
  }, [openAlert]);

  if (openAlert) {
    return (
      <Alert
        type={alertType}
        setOpenAlert={setOpenAlert}
        message={alertMessage}
        theme={theme}
      />
    );
  }

  return (
    <div
      className="class-modal"
      style={
        theme
          ? { backgroundColor: "#1a1a1a", border: "1px solid #ddd" }
          : { backgroundColor: "#f5f5f5", border: "1px solid #000" }
      }
    >
      <ClickOutside onClick={() => setClassModalOpen(false)}>
        <div className="class-modal-header">
          {type === "add" ? "Add class" : "Edit class"}
        </div>
        <div className="class-modal-name">
          <h3>Class name :</h3>
          <input
            type="text"
            className="input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="class-modal-access">
          <h3>Access :</h3>
          <div className="switch-field">
            <input
              type="radio"
              id="radio-one"
              name="switch"
              checked={newAccess}
              onChange={() => setNewAccess(true)}
            />
            <label htmlFor="radio-one">Only me</label>
            <input
              type="radio"
              id="radio-two"
              name="switch"
              checked={!newAccess}
              onChange={() => setNewAccess(false)}
            />
            <label htmlFor="radio-two">Everyone</label>
          </div>
        </div>
        <div className="submit-btn" onClick={handleSubmit}>
          Submit
        </div>
      </ClickOutside>
    </div>
  );
};

export default ClassModal;
