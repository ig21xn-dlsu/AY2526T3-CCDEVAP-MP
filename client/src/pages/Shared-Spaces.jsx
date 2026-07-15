import { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';

import SharedSpaceCard from '../components/sharedSpaces/SharedSpaceCard.jsx';
import SharedSpaceFilters, { DEFAULT_SHARED_SPACE_FILTERS } from '../components/sharedSpaces/SharedSpaceFilters.jsx';
import EmptyState from '../components/discover/EmptyState';
import SHARED_SPACES from '../dummyData/sharedSpaces.js';
import '../stylesheets/padpal.css';

function occupancyMatches(maximumCapacity, selectedOccupancy) {
  if (!selectedOccupancy?.length) return true;

  return selectedOccupancy.some((value) => {
    if (value === '1-person') return maximumCapacity === 1;
    if (value === '2-3-people') return maximumCapacity >= 2 && maximumCapacity <= 3;
    if (value === '4-plus') return maximumCapacity >= 4;
    return false;
  });
}

function textMatches(listing, searchText) {
  if (!searchText) return true;

  const haystack = [
    listing.roomTitle,
    listing.buildingName,
    listing.description,
    listing.nearestCampus,
    ...(listing.tags || []),
    ...(listing.amenities || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return haystack.includes(searchText.toLowerCase());
}

export default function SharedSpaces() {
  const [filters, setFilters] = useState(DEFAULT_SHARED_SPACE_FILTERS);
  const [listings] = useState(SHARED_SPACES);

  const filteredListings = useMemo(() => {
    const minPrice = Number(filters.minPrice);
    const maxPrice = Number(filters.maxPrice);

    return listings.filter((listing) => {
      if (!textMatches(listing, filters.search)) return false;
      if (filters.campus && listing.nearestCampus !== filters.campus) return false;
      if (Number.isFinite(minPrice) && Number(listing.price) < minPrice) return false;
      if (Number.isFinite(maxPrice) && Number(listing.price) > maxPrice) return false;
      if (!occupancyMatches(Number(listing.maximumCapacity), filters.occupancy)) return false;
      if (filters.amenities?.length && !filters.amenities.every((a) => (listing.amenities || []).includes(a))) return false;

      return true;
    });
  }, [filters, listings]);

  return (
    <main>
      <h1 className="page-title">Shared Spaces</h1>
      <p className="page-sub">Browse actual listings using the same card and full-view components.</p>

      <div className="tab-actions mb-4">
        <NavLink to="/student-discover-communities" className="button button-primary">
          Back to Discover Communities
        </NavLink>
      </div>

      <SharedSpaceFilters
        filters={filters}
        onChange={setFilters}
        onReset={() => setFilters(DEFAULT_SHARED_SPACE_FILTERS)}
      />

      {filteredListings.length ? (
        <div className="cards-grid mt-4">
          {filteredListings.map((listing) => (
            <SharedSpaceCard key={listing._id} listing={listing} />
          ))}
        </div>
      ) : (
        <EmptyState message="No shared spaces match your filters yet." />
      )}
    </main>
  );
}