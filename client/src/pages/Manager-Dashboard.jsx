import ManagerNavbar from '../components/Manager-Navbar.jsx'
import '../stylesheets/manager-dashboard.css'
import SquareStatistics from '../components/ManagerDashComponents/square-statistics.jsx';
import ChartUniversityDist from '../components/ChartJS/UniLeaderboards.jsx'

//sizeIcons 
import groupSizeIcon from '../assets/avgGrpSize.svg'
import topUniIcon from '../assets/topUni.svg'
import budgetIcon from '../assets/budgetIcon.svg'
import yourSpaces from '../assets/u_spaces.svg'
import inquiries from '../assets/inquiries.svg'
import occupiedSpace from '../assets/occupiedSpace.svg'
//---- dummy import
import leaderBoardData from '../dummyData/userBase.js';

function ManagerDashboard() {

  //---- Dummy Data for statistics delete after db -----

  let avg_grp_size = 3.2;
  let topUniversity = "";
  let avg_budget = "P 15,000";

  let user_space = 3;
  let active_inquiries = 5;
  let occupied = 1;


  const leaderBoard = leaderBoardData.data;

  const top1 = leaderBoard.sort((a, b) => b.count - a.count)[0];


  return (
    <div className="dashboard-container container-fluid">
      <ManagerNavbar />
      <div className="maincontent container-fluid d-flex flex-column p-5 gap-5">
        <div className="userStatTitleDiv d-flex flex-column align-items-end w-100">
          <h3 className="pb-2 border-bottom w-100 text-end">Your Stats </h3>
          <p>Your Listings performance.</p>
        </div>
        <div className="userStats d-flex flex-row gap-5">
          <SquareStatistics title="Your Spaces" data={user_space} icon={yourSpaces} message="Tally of all the listings that you have up" />
          <SquareStatistics title="Active Inquiries" data={active_inquiries} icon={inquiries} message="These people are reaching out to you! check your inboxes" />
          <SquareStatistics title="Currently Occupied Spaces" data={occupied} icon={occupiedSpace} message="" />
        </div>
        <div className="padpaltitle-div">
          <h3 className="pb-2 border-bottom">PadPal's Stats</h3>
          <p>We give you the data, make your best decision.</p>
        </div>
        <div className="PadPalStats d-flex flex-row gap-5 justify-content-center align-items-center">
          <SquareStatistics title="Average Group Size" data={avg_grp_size} icon={groupSizeIcon} message="Roomies usually group up in:" />
          <SquareStatistics title="Largest User Base" data={top1.University} icon={topUniIcon} message="Most of the users come from this university" />
          <SquareStatistics title="Average Budget" data={avg_budget} icon={budgetIcon} message="Roomies to pay this. Per person. Per month" />
        </div>
        <div className="leaderboard-container d-flex justify-content-center align-items-center">
          <ChartUniversityDist />
        </div>

      </div>
    </div>
  )

}
export default ManagerDashboard;
