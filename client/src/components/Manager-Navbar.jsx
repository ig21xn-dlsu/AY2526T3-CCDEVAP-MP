import '../stylesheets/manager-navbar.css'
import { NavLink } from "react-router-dom"
import notifSVG from "../assets/notification.svg"

//  This is a placeholder, pictures will be recieved through calling an API 
import profilePicture from "../assets/manager-pfp.jpg"



function ManagerNavbar() {
  return (
    <div className="navbar navbar-expand-md parent-container d-flex flex-row navbar-line
      justify-content-between align-items-center">
      <div className="leftContainer d-flex flex-row align-items-center gap-2">

        <h1 className="py-1 logo-styling">PadPal </h1>
        <h2 className="subTitle">for Space Managers</h2>

      </div>
      <div className="manager-navbar rightContainer d-flex flex-row gap-3">
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
        <NavLink>
          <img src={profilePicture} alt="profile-pic" className='rounded-circle profilePicture' />
        </NavLink>
      </div>
    </div >
  )
}


export default ManagerNavbar
