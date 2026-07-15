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
import "../../stylesheets/square-stats.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UniLeaderBoards({ data = [] }) {
  const labels = data.map(item => item.University);
  const values = data.map(item => item.count);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Groups",
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
        text: "Group Distribution by University",
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
      {data.length > 0 ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p className="m-auto">No university data yet.</p>
      )}
    </div>
  );
}
export default UniLeaderBoards;
