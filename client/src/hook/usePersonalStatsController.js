import { useState, useEffect, useCallback } from 'react';

const getToken = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  return storedUser?.token;
};

const MANAGER_STATS_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/stats/manager`;

/**
 * useManagerStats
 *
 * Fetches the logged-in manager's own listing stats:
 *  - totalListings
 *  - occupiedListings
 *  - activeInquiries (unread, past 7 days)
 *
 * Usage:
 *   const { stats, loading, error, refetch } = useManagerStats();
 */
function useManagerStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getToken();

      const res = await fetch(MANAGER_STATS_ENDPOINT, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('useManagerStats error:', err);
      setError(err.message || 'Failed to fetch manager statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export default useManagerStats;
