import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export const fetchTotalUsers = async () => {
    const { data } = await axios.get(`${API_BASE}/api/dashboard/total-users`);
    return data;
};

export const fetchTotalListings = async () => {
    const { data } = await axios.get(`${API_BASE}/api/dashboard/total-listings`);
    return data;
}

export const fetchTotalGroups = async () => {
    const { data } = await axios.get(`${API_BASE}/api/dashboard/total-groups`);
    return data;
}

export const fetchTotalReports = async () => {
    const { data } = await axios.get(`${API_BASE}/api/dashboard/total-reports`);
    return data;
}