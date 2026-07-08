import React, { useState } from 'react';
import Tabs from '../components/discover/Tabs';
import CoLivingFilters, { DEFAULT_COLIVING_FILTERS } from '../components/discover/CoLivingFilters';
import SharedFilters, { DEFAULT_SHARED_FILTERS } from '../components/discover/SharedFilters';
import GroupCard from '../components/discover/GroupCard';
import EmptyState from '../components/discover/EmptyState';
import { useAsync } from '../hook/useAsync';
import { useDebouncedValue } from '../hook/useDebouncedValue';
import { fetchCoLivingGroups, fetchSharedSpaces, fetchCampuses } from '../api/padpalApi';

import '../stylesheets/padpal.css'

export default function DiscoverCommunities() {
  const [activeTab, setActiveTab] = useState('coliving');
  const [coLivingFilters, setCoLivingFilters] = useState(DEFAULT_COLIVING_FILTERS);
  const [sharedFilters, setSharedFilters] = useState(DEFAULT_SHARED_FILTERS);

  // debounce so typing in search boxes doesn't fire a request per keystroke.
  const debouncedCoLivingFilters = useDebouncedValue(coLivingFilters, 300);
  const debouncedSharedFilters = useDebouncedValue(sharedFilters, 300);

  const { data: campuses = [] } = useAsync(fetchCampuses, []);

  const {
    data: groups,
    loading: groupsLoading,
    error: groupsError,
  } = useAsync(() => fetchCoLivingGroups(debouncedCoLivingFilters), [JSON.stringify(debouncedCoLivingFilters)]);

  const {
    data: sharedSpaces,
    loading: sharedLoading,
    error: sharedError,
  } = useAsync(() => fetchSharedSpaces(debouncedSharedFilters), [JSON.stringify(debouncedSharedFilters)]);

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
        <a href="/create" className="btn-create-group">+ Create New Group</a>
      </div>

      {loading && <p className="page-sub">Loading…</p>}
      {error && <p className="page-sub">Something went wrong: {error.message}</p>}

      {!loading && !error && (
        items && items.length ? (
          <div className="cards-grid">
            {items.map((item) => (
              <GroupCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )
      )}
    </main>
  );
}
