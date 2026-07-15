import React from 'react';
import { SearchIcon } from './icons';
import CAMPUSES from '../../assets/util/CAMPUSES.js';

const OCCUPANCY_OPTIONS = [
  { value: '1-person', label: '1 Person (Private)' },
  { value: '2-3-people', label: '2-3 People' },
  { value: '4-plus', label: '4+ People' },
];

const AMENITY_OPTIONS = [
  { value: 'Free WiFi', label: 'Free WiFi' },
  { value: 'Parking', label: 'Parking' },
  { value: 'In-Unit Laundry', label: 'In-Unit Laundry' },
  { value: 'Swimming Pool', label: 'Swimming Pool' },
  { value: '24/7 Security', label: '24/7 Security' },
  { value: 'Gym Access', label: 'Gym Access' },
  { value: 'Air Conditioning', label: 'Air Conditioning' },
  { value: 'Tap Card System', label: 'Tap Card System' },
  { value: 'Utilities Included', label: 'Utilities Included' },
  { value: 'Pet Friendly', label: 'Pet Friendly' },
  { value: 'Study Lounge', label: 'Study Lounge' },
];

const CAMPUS_OPTIONS = [
  { value: '', label: 'Any Campus' },
  ...Object.entries(CAMPUSES).map(([code, campus]) => ({
    value: code,
    label: campus.name,
  })),
];

export const DEFAULT_SHARED_FILTERS = {
  search: '',
  campus: '',
  maxDistanceKm: 2.5,
  minPrice: 0,
  maxPrice: 999999,
  occupancy: [],
  amenities: [],
};

export default function SharedFilters({ filters, onChange, onReset, onApply }) {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const toggleListValue = (key, value) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="shared-filters">
      <div className="shared-filters-grid">
        <div className="search-wrap shared-search-wrap">
          <SearchIcon />
          <input
            className="search-input"
            type="text"
            placeholder="Search listings, locations, or amenities…"
            value={filters.search}
            onChange={update('search')}
          />
        </div>

        <div className="shared-filter-card shared-filter-card--field">
          <div className="shared-labeled-field">
            <label htmlFor="sharedCampusInput">Campus / Area</label>
            <select
              id="sharedCampusInput"
              className="shared-field"
              value={filters.campus}
              onChange={update('campus')}
            >
              {CAMPUS_OPTIONS.map((option) => (
                <option key={option.value || 'any'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="shared-range-field">
          <label htmlFor="sharedDistanceSlider">Max Distance</label>
          <input
            id="sharedDistanceSlider"
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.maxDistanceKm}
            onChange={update('maxDistanceKm')}
          />
          <span>{filters.maxDistanceKm} km</span>
        </div>

        <div className="shared-filter-card shared-filter-card--price">
          <div className="shared-filter-card__header">
            <span className="shared-group-label">Price Range</span>
            <span className="shared-filter-card__hint">Set the budget window before applying</span>
          </div>
          <div className="shared-price-row">
            <div className="shared-labeled-field">
              <label htmlFor="sharedMinPrice">Min Price</label>
              <input
                id="sharedMinPrice"
                className="shared-field shared-price"
                type="number"
                value={filters.minPrice}
                onChange={update('minPrice')}
              />
            </div>
            <div className="shared-labeled-field">
              <label htmlFor="sharedMaxPrice">Max Price</label>
              <input
                id="sharedMaxPrice"
                className="shared-field shared-price"
                type="number"
                value={filters.maxPrice}
                onChange={update('maxPrice')}
              />
            </div>
          </div>
        </div>

        <div className="shared-option-group">
          <span className="shared-group-label">Occupancy</span>
          {OCCUPANCY_OPTIONS.map((o) => (
            <label className="shared-option" key={o.value}>
              <input
                type="checkbox"
                checked={filters.occupancy.includes(o.value)}
                onChange={() => toggleListValue('occupancy', o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>

        <div className="shared-option-group shared-option-group--amenities">
          <span className="shared-group-label">Must Have Amenities</span>
          {AMENITY_OPTIONS.map((o) => (
            <label className="shared-option" key={o.value}>
              <input
                type="checkbox"
                checked={filters.amenities.includes(o.value)}
                onChange={() => toggleListValue('amenities', o.value)}
              />
              <span>{o.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="shared-filter-actions">
        <button
          type="button"
          className="btn-your-group shared-apply-btn"
          onClick={() => (onApply ? onApply() : onChange({ ...filters }))}
        >
          Apply Filters
        </button>
        <button type="button" className="shared-reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
