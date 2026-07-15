import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

function authHeaders() {
  const stored = localStorage.getItem('user');
  const token = stored ? JSON.parse(stored)?.token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAdminReports(params = {}) {
  const { data } = await axios.get(`${API_BASE}/api/admin/reports`, {
    headers: authHeaders(),
    params,
  });
  return data; // { data: [...], pagination: { total } }
}

export async function fetchPendingReportCount() {
  const { data } = await axios.get(`${API_BASE}/api/admin/reports/pending-count`, {
    headers: authHeaders(),
  });
  return data.pendingCount;
}

export async function updateReportStatus(id, status, adminNotes) {
  const { data } = await axios.patch(
    `${API_BASE}/api/admin/reports/${id}`,
    { status, adminNotes },
    { headers: authHeaders() }
  );
  return data;
}