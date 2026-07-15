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
//---- hooks for real data -----
import useGroupStats from '../hook/useGroupStats.js';
import useManagerStats from '../hook/usePersonalStatsController.js';

// simple PHP-peso formatter to match the "P 15,000" look of the old dummy string
const formatBudget = (value) => {
  if (value === undefined || value === null) return 'P 0';
  return `P ${Math.round(value).toLocaleString()}`;
};

function ManagerDashboard() {
  //---- Real data for "Your Stats" section -----
  const {
    stats: managerStats,
    loading: managerLoading,
    error: managerError,
  } = useManagerStats();

  const user_space = managerLoading ? '...' : managerStats?.totalListings;
  const occupied = managerLoading ? '...' : managerStats?.occupiedListings;
  const active_inquiries = managerLoading ? '...' : managerStats?.activeInquiries;

  //---- Real data for "PadPal's Stats" section -----
  const { stats, loading, error } = useGroupStats();

  const avgGroupSize = stats ? stats.averageGroupSize : null;
  const avgMinBudget = stats ? stats.averageBudget.avgMin : null;
  const avgMaxBudget = stats ? stats.averageBudget.avgMax : null;
  const universityLeaderboard = stats ? stats.universityLeaderboard : [];

  return (
    <div className="dashboard-container container-fluid">
      <ManagerNavbar />
      <div className="maincontent container-fluid d-flex flex-column p-5 gap-5">
        <div className="userStatTitleDiv d-flex flex-column align-items-end w-100">
          <h3 className="pb-2 border-bottom w-100 text-end">Your Stats </h3>
          <p>Your Listings performance.</p>
        </div>

        {managerError && <p className="text-danger">Couldn't load your stats: {managerError}</p>}

        <div className="userStats d-flex flex-row gap-5">
          <SquareStatistics title="Your Spaces" data={user_space} icon={yourSpaces} message="Tally of all the listings that you have up" />
          <SquareStatistics title="Active Inquiries" data={active_inquiries} icon={inquiries} message="These people are reaching out to you! check your inboxes" />
          <SquareStatistics title="Currently Occupied Spaces" data={occupied} icon={occupiedSpace} message="" />
        </div>
        <div className="padpaltitle-div">
          <h3 className="pb-2 border-bottom">PadPal's Stats</h3>
          <p>We give you the data, make your best decision.</p>
        </div>

        {error && <p className="text-danger">Couldn't load PadPal's stats: {error}</p>}

        <div className="PadPalStats d-flex flex-row gap-5 justify-content-center align-items-center">
          <SquareStatistics
            title="Average Group Size"
            data={loading ? '...' : avgGroupSize}
            icon={groupSizeIcon}
            message="Roomies usually group up in:"
          />
          <SquareStatistics
            title="Average Minimum Budget"
            data={loading ? '...' : formatBudget(avgMinBudget)}
            icon={budgetIcon}
            message="Lowest Amount that Roomies want to pay"
          />
          <SquareStatistics
            title="Average Maximum Budget"
            data={loading ? '...' : formatBudget(avgMaxBudget)}
            icon={budgetIcon}
            message="Highest Amount that roomies want to pay"
          />
        </div>
        <div className="leaderboard-container d-flex justify-content-center align-items-center">
          <ChartUniversityDist data={universityLeaderboard} />
        </div>
      </div>
    </div>
  )
}
export default ManagerDashboard;
