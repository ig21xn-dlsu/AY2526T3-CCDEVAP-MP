import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PALETTE = ['#0C7C3D', '#003A6C', '#FFC72C', '#7B1113', '#5E4B8B', '#2C7DA0', '#B5651D'];

function GroupsByUniversityChart({ data }) {
    if (!data || data.length === 0) {
        return <div className="chart-empty">No group data yet.</div>;
    }

    const chartData = {
        labels: data.map((d) => d.university),
        datasets: [
            {
                data: data.map((d) => d.count),
                backgroundColor: data.map((_, i) => PALETTE[i % PALETTE.length]),
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
        },
    };

    return <Pie data={chartData} options={options} />;
}

export default GroupsByUniversityChart;