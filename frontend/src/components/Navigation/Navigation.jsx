import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { useNavigate } from "react-router";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const navigate = useNavigate();

  const createSpot = () => {
    navigate("/spots/new");
  };

  return (
    <ul className="nav">
      <li>
        <NavLink to="/">
          <img src="../../images/HauntHome.png" alt="Hauntbnb Home" data-testid='logo' />
        </NavLink>
      </li>
      {isLoaded && (
        <li className="userMenus">
          {sessionUser && (
            <button className="newSpot" onClick={createSpot}>
              Create a New Spot
            </button>
          )}
          <ProfileButton user={sessionUser} data-testid='user-menu-button'/>
        </li>
      )}
    </ul>
  );
}

export default Navigation;
