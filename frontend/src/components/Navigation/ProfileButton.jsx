import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <button onClick={toggleMenu} className="profileButton" data-testid='user-menu-button'>
        <FaUserCircle />
      </button>
      <ul className={ulClassName} ref={ulRef} data-testid='user-dropdown-menu'>
        {user ? (
          <>
            <li>Hello {user.firstName}</li>
            <li>{user.email}</li>
            <li><Link to={'/spots/current'} className="curentSpots" data-testid="user-spots">Manage Spots</Link></li>
            <li>
              <button onClick={logout} className="logout">
                Log Out
              </button>
            </li>
          </>
        ) : (
          <div className="modals">
            <div className="modalLogin">
              <OpenModalMenuItem
                itemText="Log In"
                onItemClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            </div>
            <div className="modalSignup">
              <OpenModalMenuItem
                itemText="Sign Up"
                onItemClick={closeMenu}
                modalComponent={<SignupFormModal />}
              />
            </div>
          </div>
        )}
      </ul>
    </>
  );
}

export default ProfileButton;
