import { useState, useEffect } from "react";
import ClickOutside from "../ClickOutside";
import Alert from "../Alert/Alert.jsx";
const URL = import.meta.env.VITE_API_URL;

const StudentModal = ({
  type,
  setStudentModalOpen,
  name,
  roll,
  setRefresh,
  theme,
  classid,
  studentid,
}) => {
  const [newName, setNewName] = useState(name || "");
  const [newRoll, setNewRoll] = useState(roll || 0);
  const [alertType, setAlertType] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const token = localStorage.getItem("auth-token");
  const url = `${URL}${
    type === "add" ? `addstudent/${classid}` : `updatestudent/${studentid}`
  }`;

  const handleSubmit = async () => {
    try {
      const response = await fetch(url, {
        method: `${type === "add" ? "POST" : "PUT"}`,
        body: JSON.stringify({ name: newName, roll: newRoll }),
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
      setAlertMessage(err);
    }
    setOpenAlert(true);
  };

  useEffect(() => {
    if (!openAlert && alertType !== "") {
      setStudentModalOpen(false);
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
      <ClickOutside onClick={() => setStudentModalOpen(false)}>
        <div className="class-modal-header">
          {type === "add" ? "Add student" : "Edit student"}
        </div>
        <div className="class-modal-name">
          <h3>Student name :</h3>
          <input
            type="text"
            className="input"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </div>
        <div className="class-modal-name">
          <h3>Roll :</h3>
          <input
            type="number"
            className="input"
            value={newRoll}
            onChange={(e) => setNewRoll(e.target.value)}
          />
        </div>
        <div className="submit-btn" onClick={handleSubmit}>
          Submit
        </div>
      </ClickOutside>
    </div>
  );
};

export default StudentModal;
