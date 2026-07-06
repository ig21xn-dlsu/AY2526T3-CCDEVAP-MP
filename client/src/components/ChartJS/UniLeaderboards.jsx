import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

//Shares styling with square statistics
import "../../stylesheets/square-stats.css"

//Dummy Data 
import leaderboardResponse from "../../dummyData/userBase";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UniLeaderBoards() {
  const labels = leaderboardResponse.data.map(item => item.University);
  const values = leaderboardResponse.data.map(item => item.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Users",
        data: values,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "User Distribution by University",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };
  return (
    <div className="card shadow p-3 soft-card d-flex flex-row ">
      <Bar data={chartData} options={options} />
    </div>
  );
}

export default UniLeaderBoards;
