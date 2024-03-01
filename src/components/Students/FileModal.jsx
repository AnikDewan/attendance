import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import ClickOutside from "../ClickOutside";
import Alert from "../Alert/Alert.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
const URL = import.meta.env.VITE_API_URL;
import "./FileModal.css";

const FileModal = ({ setModalVisible, setRefresh, classid, theme }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedName, setSelectedName] = useState("");
  const [fileData, setFileData] = useState([]);

  const [alertType, setAlertType] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const token = localStorage.getItem("auth-token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setSelectedFile(file);
      setSelectedName(file.name);
    } else {
      setAlertType("error");
      setAlertMessage("Please upload a valid Excel file (xlsx or xls)");
      setOpenAlert(true);
    }
  };

  const handleUpload = async () => {
    try {
      if (selectedFile) {
        const reader = new FileReader();
        reader.readAsBinaryString(selectedFile);
        reader.onload = async (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(sheet);
          console.log(parsedData);
          const response = await fetch(`${URL}addmanystudents/${classid}`, {
            method: "POST",
            body: JSON.stringify(parsedData),
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
          setOpenAlert(true);
        };
      } else {
        setAlertType("error");
        setAlertMessage("Please select a valid Excel file before uploading.");
        setOpenAlert(true);
      }
    } catch (err) {
      setAlertType("error");
      setOpenAlert(true);
    }
  };

  useEffect(() => {
    if (!openAlert && alertType !== "") {
      setModalVisible(false);
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
    <ClickOutside onClick={() => setModalVisible(false)}>
      <div
        className="modal-content"
        style={
          theme
            ? { backgroundColor: "#1a1a1a", border: "1px solid #ddd" }
            : { backgroundColor: "#f5f5f5", border: "1px solid #000" }
        }
      >
        <div className="modal-input">
          <FontAwesomeIcon icon={faCloudArrowUp} />
          <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        </div>
        <div className="file-info">
          <strong>{selectedName || "Select a excel file"}</strong>
          <button className="submit-btn" onClick={handleUpload}>
            Upload
          </button>
        </div>
      </div>
    </ClickOutside>
  );
};

export default FileModal;
