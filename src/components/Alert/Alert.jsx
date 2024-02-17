import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faTriangleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import ClickOutside from "../ClickOutside";
import "./Alert.css";

const Alert = ({ type, setOpenAlert, setConfirmed, message, theme }) => {
  const handleCancelOrOK = () => {
    setOpenAlert(false);
  };
  const handleDeleteOrLogout = () => {
    setConfirmed(true);
  };

  const typeObj = {
    success: {
      color: "#63E6BE",
      icon: faCircleCheck,
      buttons: [
        {
          btntext: "OK",
          btncolor: "#63E6BE",
          btnfunc: handleCancelOrOK,
        },
      ],
      title: "Success",
      message: "Your request has been successfully submitted",
    },
    error: {
      color: "#FF3B3B",
      icon: faCircleExclamation,
      buttons: [
        {
          btntext: "OK",
          btncolor: "#FF3B3B",
          btnfunc: handleCancelOrOK,
        },
      ],
      title: "Error",
      message: "Something went wrong, please try again later",
    },
    delete: {
      color: "#FFD43B",
      icon: faTriangleExclamation,
      buttons: [
        {
          btntext: "Cancel",
          btncolor: "#30d9cd",
          btnfunc: handleCancelOrOK,
        },
        {
          btntext: "Delete",
          btncolor: "#FF3B3B",
          btnfunc: handleDeleteOrLogout,
        },
      ],
      title: "Warning",
      message: "Are you sure ? Deleted item could never be retrieved",
    },
    logout: {
      color: "#FF3B3B",
      icon: faTriangleExclamation,
      buttons: [
        {
          btntext: "Cancel",
          btncolor: "#30d9cd",
          btnfunc: handleCancelOrOK,
        },
        {
          btntext: "Logout",
          btncolor: "#FF3B3B",
          btnfunc: handleDeleteOrLogout,
        },
      ],
      title: "Warning",
      message: "Are you sure ? You will be logged out",
    },
  };

  return (
    <div
      className="alert-container"
      style={
        theme
          ? { backgroundColor: "#1a1a1a", border: "1px solid #ddd" }
          : { backgroundColor: "#f5f5f5", border: "1px solid #000" }
      }
    >
      <ClickOutside onClick={() => setOpenAlert(false)}>
        <div className="alert-icon">
          <FontAwesomeIcon
            icon={typeObj[type].icon}
            style={{ color: typeObj[type].color }}
          />
        </div>
        <div className="alert-title">{typeObj[type].title}</div>
        <div className="alert-message">{message || typeObj[type].message}</div>
        <div className="alert-button-container">
          {typeObj[type].buttons.map((item, index) => (
            <button
              key={index}
              className="alert-button"
              onClick={item.btnfunc}
              style={{ backgroundColor: item.btncolor }}
            >
              {item.btntext}
            </button>
          ))}
        </div>
      </ClickOutside>
    </div>
  );
};

export default Alert;
