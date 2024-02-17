import "./Menu.css";
import Toggle from "../Toggle/Toggle";
import Logout from "../Logout/Logout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const Menu = ({ name, state, theme, toggle }) => {
  return (
    <div
      className="menu"
      style={state ? { display: "flex" } : { display: "none" }}
    >
      <div className="profile">
        <div
          className="profile-icon"
          style={
            theme
              ? { backgroundColor: "#1a1a1a" }
              : { backgroundColor: "#f5f5f5" }
          }
        >
          <FontAwesomeIcon icon={faUser} />
        </div>
        <p>{name}</p>
      </div>
      <div className="toggle">
        <p>Theme </p>
        <Toggle theme={theme} toggle={toggle} />
      </div>
      <div className="logout">
        <p>Logout </p>
        <Logout />
      </div>
    </div>
  );
};
export default Menu;
