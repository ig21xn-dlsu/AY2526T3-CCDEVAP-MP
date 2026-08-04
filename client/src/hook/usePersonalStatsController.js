import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const MANAGER_STATS_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/stats/manager`;

function useManagerStats() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!user?.token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(MANAGER_STATS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${user.token}`,
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
  }, [user?.token]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export default useManagerStats;
