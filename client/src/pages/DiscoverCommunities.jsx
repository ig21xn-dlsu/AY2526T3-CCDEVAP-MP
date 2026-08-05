import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import Tabs from '../components/discover/Tabs';
import CoLivingFilters, { DEFAULT_COLIVING_FILTERS } from '../components/discover/CoLivingFilters';
import SharedFilters, { DEFAULT_SHARED_FILTERS } from '../components/discover/SharedFilters';
import GroupCard from '../components/discover/GroupCard';
import SharedSpaceCard from '../components/sharedSpaces/SharedSpaceCard.jsx';
import EmptyState from '../components/discover/EmptyState';
import { useAsync } from '../hook/useAsync';
import { useDebouncedValue } from '../hook/useDebouncedValue';
import useTheme from '../hook/useTheme.js';
import { useLogOut } from '../hook/useLogOut.js';
import { fetchMyGroup } from '../api/padpalApi';
import { useAuthContext } from '../hook/useAuthContext';

import '../stylesheets/padpal.css'

const API_BASE = import.meta.env.VITE_API_URL ?? '';

function apiPath(path) {
  const base = API_BASE.replace(/\/$/, '');
  return `${base}/api${path}`;
}

async function fetchDiscoverCampuses() {
  const response = await fetch(apiPath('/campuses'), { credentials: 'include' });
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`PadPal API error (${response.status}): ${message || response.statusText}`);
  }
  return response.json();
}

async function fetchDiscoverSharedSpaces(filters) {
  const query = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
    } else {
      query.append(key, value);
    }
  });

  const response = await fetch(apiPath(`/shared-spaces${query.toString() ? `?${query.toString()}` : ''}`), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`PadPal API error (${response.status}): ${message || response.statusText}`);
  }

  return response.json();
}

async function fetchDiscoverGroups(filters) {
  const query = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, value);
  });

  const response = await fetch(apiPath(`/groups${query.toString() ? `?${query.toString()}` : ''}`), {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(`PadPal API error (${response.status}): ${message || response.statusText}`);
  }

  return response.json();
}

function readSessionCache(cacheKey) {
  try {
    const raw = sessionStorage.getItem(cacheKey);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeSessionCache(cacheKey, value) {
  try {
    sessionStorage.setItem(cacheKey, JSON.stringify(value));
  } catch {
    // ignore storage failures and fall back to in-memory fetch results
  }
}

function readSessionState(stateKey, fallbackValue) {
  try {
    const raw = sessionStorage.getItem(stateKey);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function useSessionState(stateKey, fallbackValue) {
  const [value, setValue] = useState(() => readSessionState(stateKey, fallbackValue));

  useEffect(() => {
    try {
      sessionStorage.setItem(stateKey, JSON.stringify(value));
    } catch {
      // ignore storage failures and keep the in-memory state working
    }
  }, [stateKey, value]);

  return [value, setValue];
}

function useCachedQuery(asyncFn, cacheKey, deps = []) {
  const [state, setState] = useState(() => {
    const cached = readSessionCache(cacheKey);
    return {
      data: cached ?? undefined,
      loading: !cached,
      error: null,
    };
  });

  useEffect(() => {
    let active = true;
    const cached = readSessionCache(cacheKey);

    if (cached) {
      setState({ data: cached, loading: false, error: null });
    } else {
      setState((current) => ({ ...current, loading: true, error: null }));
    }

    asyncFn()
      .then((data) => {
        if (!active) return;
        setState({ data, loading: false, error: null });
        writeSessionCache(cacheKey, data);
      })
      .catch((error) => {
        if (!active) return;
        setState({ data: cached ?? undefined, loading: false, error });
      });

    return () => {
      active = false;
    };
  }, [cacheKey, ...deps]);

  return state;
}

export default function DiscoverCommunities() {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useLogOut();
  const navigate = useNavigate();
  const [ownGroupMessage, setOwnGroupMessage] = useState('');
  const [activeTab, setActiveTab] = useSessionState('discover:activeTab', 'coliving');
  const [coLivingFilters, setCoLivingFilters] = useSessionState('discover:colivingFilters', DEFAULT_COLIVING_FILTERS);
  const [sharedDraftFilters, setSharedDraftFilters] = useSessionState('discover:sharedDraftFilters', DEFAULT_SHARED_FILTERS);
  const [sharedAppliedFilters, setSharedAppliedFilters] = useSessionState('discover:sharedAppliedFilters', DEFAULT_SHARED_FILTERS);

  // debounce so typing in search boxes doesn't fire a request per keystroke.
  const debouncedCoLivingFilters = useDebouncedValue(coLivingFilters, 300);
  const debouncedSharedFilters = useDebouncedValue(sharedAppliedFilters, 300);

  const campusCacheKey = 'discover:campuses';
  const { data: campuses = [] } = useCachedQuery(fetchDiscoverCampuses, campusCacheKey, []);

  const coLivingCacheKey = `discover:coliving:${JSON.stringify(debouncedCoLivingFilters)}`;
  const sharedCacheKey = `discover:shared:${JSON.stringify(debouncedSharedFilters)}`;

  const {
    data: groups,
    loading: groupsLoading,
    error: groupsError,
  } = useCachedQuery(() => fetchDiscoverGroups(debouncedCoLivingFilters), coLivingCacheKey, [JSON.stringify(debouncedCoLivingFilters)]);

  const { data: myGroup } = useAsync(fetchMyGroup, []);
  const { user } = useAuthContext();

  const {
    data: sharedSpaces,
    loading: sharedLoading,
    error: sharedError,
  } = useCachedQuery(() => fetchDiscoverSharedSpaces(debouncedSharedFilters), sharedCacheKey, [JSON.stringify(debouncedSharedFilters)]);

  function handleViewOwnGroup() {
    const groupId = typeof myGroup === 'string' ? myGroup : myGroup?.id;
    if (groupId) {
      navigate(`/student-group-profile/${groupId}`);
      return;
    }

    // If the cached value is not yet present (e.g. still loading), fetch on demand
    // to avoid race conditions where the initial request hasn't finished.
    (async () => {
      try {
        const res = await fetchMyGroup();
        const fetchedId = typeof res === 'string' ? res : res?.id;
        if (fetchedId) {
          navigate(`/student-group-profile/${fetchedId}`);
          return;
        }
        // Fallback: if API didn't return a group, try to find a group in the
        // currently loaded list where the current user is listed as a member.
        if (user && Array.isArray(groups)) {
          const found = (groups || []).find((g) => Array.isArray(g.members) && g.members.some((m) => String(m?.id) === String(user.id)));
          if (found) {
            navigate(`/student-group-profile/${found.id}`);
            return;
          }
        }
      } catch (e) {
        // ignore fetch errors here and show the default message below
      }
      setOwnGroupMessage('You do not have a group yet. Apply to join one or create your own.');
    })();
  }

  const isColiving = activeTab === 'coliving';
  const items = isColiving ? groups : sharedSpaces;
  const loading = isColiving ? groupsLoading : sharedLoading;
  const error = isColiving ? groupsError : sharedError;

  return (
    <main>
      <div className="d-flex justify-content-end mb-2 gap-2">
  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={toggleTheme}>
    {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
  </button>
  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={logout}>
    Log Out
  </button>
</div>
      <h1 className="page-title">Discover Communities</h1>
      <p className="page-sub">Find the perfect group or space that matches your vibe.</p>

      <div className="tab-actions d-flex flex-wrap gap-2 align-items-center justify-content-end">
        <NavLink to="/student-create-group" className="button button-primary">+ Create New Group</NavLink>
      </div>
      {ownGroupMessage ? (
        <p style={{ marginTop: 10, color: '#6b7280', fontSize: '0.95rem' }}>{ownGroupMessage}</p>
      ) : null}

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <div id="tabControls">
        {isColiving ? (
          <CoLivingFilters filters={coLivingFilters} onChange={setCoLivingFilters} campuses={campuses || []} />
        ) : (
          <SharedFilters
            filters={sharedDraftFilters}
            onChange={setSharedDraftFilters}
            onApply={() => setSharedAppliedFilters(sharedDraftFilters)}
            onReset={() => {
              setSharedDraftFilters(DEFAULT_SHARED_FILTERS);
              setSharedAppliedFilters(DEFAULT_SHARED_FILTERS);
            }}
          />
        )}
      </div>

      {loading && <p className="page-sub">Loading…</p>}
      {error && <p className="page-sub">Something went wrong: {error.message}</p>}

      {!loading && !error && (
        items && items.length ? (
          <div className="cards-grid">
            {items.map((item) => (
              isColiving
                ? <GroupCard key={item.id} item={item} />
                : <SharedSpaceCard key={item.id} listing={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )
      )}
    </main>
  );
}
