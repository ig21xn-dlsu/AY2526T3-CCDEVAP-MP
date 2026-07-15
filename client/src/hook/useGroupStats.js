import { useState, useEffect, useCallback } from 'react';

const STATS_ENDPOINT = `${import.meta.env.VITE_API_URL}/api/stats/groups`;

/**
 * useGroupStats
 *
 * Fetches PadPal-wide group statistics:
 *  - averageGroupSize
 *  - averageBudget: { avgMin, avgMax, avgMidpoint }
 *  - mostCommonUniversity: { University, count } | null
 *  - universityLeaderboard: [{ University, count }, ...] (sorted desc, ready for the chart)
 *
 * Usage:
 *   const { stats, loading, error, refetch } = useGroupStats();
 */
function useGroupStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(STATS_ENDPOINT);
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('useGroupStats error:', err);
      setError(err.message || 'Failed to fetch group statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}

export default useGroupStats;
