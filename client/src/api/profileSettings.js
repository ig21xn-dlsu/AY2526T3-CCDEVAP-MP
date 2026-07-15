const API_BASE = import.meta.env.VITE_API_URL || '';

export const updateProfile = async (userId, updates, token) => {
    const res = await fetch(`${API_BASE}/api/auth/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Failed to update profile.');
    }

    return data;
};

export const updatePassword = async (userId, passwords, token) => {
    const res = await fetch(`${API_BASE}/api/auth/${userId}/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(passwords),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.message || 'Failed to update password.');
    }

    return data;
};