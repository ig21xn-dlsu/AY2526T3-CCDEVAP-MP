const API_BASE = import.meta.env.VITE_API_URL ?? '';

function getToken() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  return storedUser?.token;
}

export async function submitReport(listingId, reason) {
  const token = getToken();

  const response = await fetch(`${API_BASE}/api/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ listingId, reason }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Failed to submit report.');
  }

  return data;
}