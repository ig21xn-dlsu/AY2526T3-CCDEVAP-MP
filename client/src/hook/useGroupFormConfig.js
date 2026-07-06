import { useEffect, useState } from 'react';
import { fetchGroupFormConfig } from '../api/groupService.js'; // api placeholder

// fallback config
const EMPTY_CONFIG = {
  lifestyleTags: [],
  genderPreferences: [],
  budget: { min: 0, max: 0, step: 500, defaultMin: 0, defaultMax: 0, currencySymbol: '' },
  spots: { min: 1, max: 10, default: 1 },
};

export function useGroupFormConfig() {
  const [config, setConfig] = useState(EMPTY_CONFIG);
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setStatus('loading');
      setError(null);
      try {
        const data = await fetchGroupFormConfig(controller.signal);
        setConfig({ ...EMPTY_CONFIG, ...data });
        setStatus('success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err);
        setStatus('error');
      }
    }

    load();
    return () => controller.abort();
  }, []);

  return { config, status, error, isLoading: status === 'loading' };
}
