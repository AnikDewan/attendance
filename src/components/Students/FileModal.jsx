import { useState } from "react";
import ClickOutside from "../ClickOutside";
import "./FileModal.css"; // Import your CSS file

const FileModal = ({setModalVisible}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      (file.type === "application/vnd.ms-excel" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid Excel file (xlsx or xls)");
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("excelFile", selectedFile);

      // Send formData to the backend
      fetch("http://localhost:3001/upload", {
        method: "POST",
        body: JSON.stringify({ excelFile: selectedFile }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          //  Handle response from the backend
          console.log("Backend response:", data);
        })
        .catch((error) => console.error("Error uploading file:", error));
      setModalVisible(false);
    } else {
      alert("Please select a valid Excel file before uploading.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <ClickOutside onClick={() => setModalVisible(false)}>
      <div className="modal-content">
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload</button>
      </div>
    </ClickOutside>
  );
};

export default FileModal;
