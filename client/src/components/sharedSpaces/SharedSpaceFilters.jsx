import { SearchIcon } from '../discover/icons';

const OCCUPANCY_OPTIONS = [
  { value: '1-person', label: '1 Person (Private)' },
  { value: '2-3-people', label: '2-3 People' },
  { value: '4-plus', label: '4+ People' },
];

const AMENITY_OPTIONS = [
  { value: 'laundry', label: 'Laundry' },
  { value: 'furnished', label: 'Furnished' },
  { value: 'semi-furnished', label: 'Semi-Furnished' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'gym', label: 'Gym' },
  { value: 'parking', label: 'Parking' },
];

export const DEFAULT_SHARED_SPACE_FILTERS = {
  search: '',
  campus: '',
  maxDistanceKm: 2.5,
  minPrice: 10000,
  maxPrice: 20000,
  occupancy: ['2-3-people'],
  amenities: [],
};

function SharedSpaceFilters({ filters, onChange, onReset }) {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  const toggleListValue = (key, value) => {
    const current = filters[key];
    const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
    onChange({ ...filters, [key]: next });
  };

  return (
    <div className="shared-space-filters shared-filters">
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
            <input
              id="sharedCampusInput"
              className="shared-field"
              type="text"
              placeholder="De La Salle University"
              value={filters.campus}
              onChange={update('campus')}
            />
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
          {OCCUPANCY_OPTIONS.map((option) => (
            <label className="shared-option" key={option.value}>
              <input
                type="checkbox"
                checked={filters.occupancy.includes(option.value)}
                onChange={() => toggleListValue('occupancy', option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        <div className="shared-option-group">
          <span className="shared-group-label">Must Have Amenities</span>
          {AMENITY_OPTIONS.map((option) => (
            <label className="shared-option" key={option.value}>
              <input
                type="checkbox"
                checked={filters.amenities.includes(option.value)}
                onChange={() => toggleListValue('amenities', option.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="shared-filter-actions">
        <button type="button" className="btn btn-primary shared-apply-btn" onClick={() => onChange({ ...filters })}>
          Apply Filters
        </button>
        <button type="button" className="btn btn-outline-secondary shared-reset-btn" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default SharedSpaceFilters;