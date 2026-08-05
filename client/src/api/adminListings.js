import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

function authHeaders() {
  const stored = localStorage.getItem('user');
  const token = stored ? JSON.parse(stored)?.token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchAdminListings(params = {}) {
  const { data } = await axios.get(`${API_BASE}/api/admin/listing`, {
    headers: authHeaders(),
    params,
  });
  return data; // expects { data: [...], pagination: { total } }
}

export async function createAdminListing(payload) {
  const { data } = await axios.post(`${API_BASE}/api/admin/listing`, payload, {
    headers: authHeaders(),
  });
  return data;
}

export async function updateAdminListing(id, payload) {
  const { data } = await axios.put(`${API_BASE}/api/admin/listing/${id}`, payload, {
    headers: authHeaders(),
  });
  return data;
}

export async function setListingSoftDeleted(id, isDeleted) {
  const { data } = await axios.patch(
    `${API_BASE}/api/admin/listing/${id}`,
    { isDeleted, deletedAt: isDeleted ? new Date().toISOString() : null },
    { headers: authHeaders() }
  );
  return data;
}