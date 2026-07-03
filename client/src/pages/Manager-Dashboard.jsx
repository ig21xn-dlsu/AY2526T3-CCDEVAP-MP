import ManagerNavbar from '../components/Manager-Navbar.jsx'
import '../stylesheets/manager-dashboard.css'

function ManagerDashboard() {


  return (
    <div className="dashboard-container">
      <ManagerNavbar />
      <div className="maincontent">
        <div className="PadPalStats">
        </div>
        <div className="userStats">
        </div>
      </div>
    </div>
  )

}
export default ManagerDashboard;
