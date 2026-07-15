import '../stylesheets/manager-navbar.css'
import { NavLink } from "react-router-dom"
import notifSVG from "../assets/notification.svg"
import { useState, useContext } from "react"
import logoutSVG from "../assets/logout.svg";
// This is a placeholder, pictures will be recieved through calling an API 
import profilePicture from "../assets/manager-pfp.jpg"
import ProfileSettingsModal from "../components/ProfileSettingsModal.jsx"
import useTheme from "../hook/useTheme.js"
import { AuthContext } from '../context/AuthContext.jsx';

function ManagerNavbar() {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const { dispatch } = useContext(AuthContext);
  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  }


  return (
    <div className="navbar navbar-expand-md parent-container d-flex flex-row navbar-line
      justify-content-between align-items-center">
      <div className="leftContainer d-flex flex-row align-items-center gap-2">
        <h1 className="py-1 logo-styling">PadPal </h1>
        <h2 className="subTitle">for Space Managers</h2>
      </div>
      <div className="d-flex flex-row gap-4 pe-5 align-items-center">
        <NavLink to="/manager-calling-card" className={({ isActive }) =>
          isActive ? "nav-entry nav-active" : "nav-entry"
        }>CallingCard</NavLink>
        <NavLink to="/manager-listings" className={({ isActive }) =>
          isActive ? "nav-entry nav-active" : "nav-entry"
        }>listings</NavLink>
        <NavLink to="/manager-dashboard" className={({ isActive }) =>
          isActive ? "nav-entry nav-active" : "nav-entry"
        }>dashboard</NavLink>
        <NavLink to="/manager-notifications">
          <div className="notificationContainer">
            <img src={notifSVG} alt="" />
            <span className="notificationBadge"></span>
          </div>
        </NavLink>
        <button
          type="button"
          onClick={toggleTheme}
          className="btn btn-outline-secondary btn-sm themeToggleBtn"
          aria-label="Toggle dark mode"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>

        <button className="btn btn-outline btn-sm" aria-label="logout" type="button" onClick={handleLogout}>
          <img src={logoutSVG} alt="" className="" style={{ width: '20px', height: '20px' }} />
        </button>
        <div onClick={() => setOpenProfileModal(true)} className='openProfileDiv'>
          <img src={profilePicture} alt="profile-pic" className='rounded-circle profilePicture' />
        </div>
      </div>
      {
        openProfileModal && (
          <ProfileSettingsModal onClose={() => setOpenProfileModal(false)} />
        )
      }
    </div >
  )
}
export default ManagerNavbar
