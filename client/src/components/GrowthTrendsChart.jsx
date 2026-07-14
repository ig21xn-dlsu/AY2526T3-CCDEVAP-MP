import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// BY IAN: I DO NOT UNDERSTAND IT THAT MUCH PLEASE HAVE MERCY ON ME

function GrowthTrendsChart({ data }) {
    
    const chartData = {
        labels: data.map((d) => d.month),
        datasets: [
            {
                label: 'Users',
                data: data.map((d) => d.users),
                borderColor: '#3B82F6', // blue
                backgroundColor: '#3B82F6',
                tension: 0.3, 
            },
            {
                label: 'Listings',
                data: data.map((d) => d.listings),
                borderColor: '#F97316', 
                backgroundColor: '#F97316',
                tension: 0.3,
            },
            {
                label: 'Groups',
                data: data.map((d) => d.groups),
                borderColor: '#8B5CF6', 
                backgroundColor: '#8B5CF6',
                tension: 0.3,
            },
            {
                label: 'Reports',
                data: data.map((d) => d.reports),
                borderColor: '#EF4444', 
                backgroundColor: '#EF4444',
                tension: 0.3,
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
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1, 
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
}

export default GrowthTrendsChart;