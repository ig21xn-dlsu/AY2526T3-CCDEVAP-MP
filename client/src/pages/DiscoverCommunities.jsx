import React, { useState } from 'react';
import Tabs from '../components/discover/Tabs';
import CoLivingFilters, { DEFAULT_COLIVING_FILTERS } from '../components/discover/CoLivingFilters';
import SharedFilters, { DEFAULT_SHARED_FILTERS } from '../components/discover/SharedFilters';
import GroupCard from '../components/discover/GroupCard';
import SharedSpaceCard from '../components/sharedSpaces/SharedSpaceCard.jsx';
import EmptyState from '../components/discover/EmptyState';
import { useAsync } from '../hook/useAsync';
import { useDebouncedValue } from '../hook/useDebouncedValue';
import { fetchCoLivingGroups, fetchSharedSpaces, fetchCampuses } from '../api/padpalApi';

import '../stylesheets/padpal.css'
import { NavLink } from "react-router-dom";

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

export default function DiscoverCommunities() {
  const [activeTab, setActiveTab] = useState('coliving');
  const [coLivingFilters, setCoLivingFilters] = useState(DEFAULT_COLIVING_FILTERS);
  const [sharedFilters, setSharedFilters] = useState(DEFAULT_SHARED_FILTERS);

  // debounce so typing in search boxes doesn't fire a request per keystroke.
  const debouncedCoLivingFilters = useDebouncedValue(coLivingFilters, 300);
  const debouncedSharedFilters = useDebouncedValue(sharedFilters, 300);

  const { data: campuses = [] } = useAsync(fetchDiscoverCampuses, []);

  const {
    data: groups,
    loading: groupsLoading,
    error: groupsError,
  } = useAsync(() => fetchCoLivingGroups(debouncedCoLivingFilters), [JSON.stringify(debouncedCoLivingFilters)]);

  const {
    data: sharedSpaces,
    loading: sharedLoading,
    error: sharedError,
  } = useAsync(() => fetchDiscoverSharedSpaces(debouncedSharedFilters), [JSON.stringify(debouncedSharedFilters)]);

  const isColiving = activeTab === 'coliving';
  const items = isColiving ? groups : sharedSpaces;
  const loading = isColiving ? groupsLoading : sharedLoading;
  const error = isColiving ? groupsError : sharedError;

  return (
    <main>
      <h1 className="page-title">Discover Communities</h1>
      <p className="page-sub">Find the perfect group or space that matches your vibe.</p>

      <Tabs activeTab={activeTab} onChange={setActiveTab} />

      <div id="tabControls">
        {isColiving ? (
          <CoLivingFilters filters={coLivingFilters} onChange={setCoLivingFilters} campuses={campuses || []} />
        ) : (
          <SharedFilters
            filters={sharedFilters}
            onChange={setSharedFilters}
            onReset={() => setSharedFilters(DEFAULT_SHARED_FILTERS)}
          />
        )}
      </div>

      <div className="tab-actions">
        <NavLink to="/student-create-group" className="button button-primary">+ Create New Group</NavLink>
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
