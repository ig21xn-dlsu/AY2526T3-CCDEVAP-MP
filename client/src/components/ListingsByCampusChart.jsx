import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CAMPUS_LABELS = {
    DLSU: 'De La Salle University',
    ADMU: 'Ateneo de Manila University',
    UST: 'University of Santo Tomas',
    UPD: 'UP Diliman',
    UPM: 'UP Manila',
};

const CAMPUS_COLORS = {
    DLSU: '#0C7C3D',
    ADMU: '#003A6C',
    UST: '#FFC72C',
    UPD: '#7B1113',
    UPM: '#A6373C',
};

function ListingsByCampusChart({ data }) {
    if (!data || data.length === 0) {
        return <div className="chart-empty">No listing data yet.</div>;
    }

    const chartData = {
        labels: data.map((d) => CAMPUS_LABELS[d.campus] || d.campus),
        datasets: [
            {
                data: data.map((d) => d.count),
                backgroundColor: data.map((d) => CAMPUS_COLORS[d.campus] || '#727687'),
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

export default ListingsByCampusChart;