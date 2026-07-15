import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? "/api";

export const fetchUsers = async (page = 1, limit = 10, search = '') => {
    const { data } = await axios.get(
        `${API_BASE}/api/admin/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
    );
    return data;
};

export const updateUserStatus = async (userId, status) => {
    const { data } = await axios.patch(`${API_BASE}/api/admin/users/${userId}/status`, { status });
    return data;
};

export const getCSVExportUrl = () => {
    return `${API_BASE}/api/admin/users/export/csv`;
};