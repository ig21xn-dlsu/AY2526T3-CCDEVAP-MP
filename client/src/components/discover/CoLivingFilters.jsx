import React from 'react';
import { SearchIcon } from './icons';

// fixed gender and budget options for coliving filters 
const GENDER_OPTIONS = [
  { value: '', label: 'Gender: Any' },
  { value: 'Co-ed', label: 'Co-ed' },
  { value: 'All Girls', label: 'All Girls' },
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Budget: Any' },
  { value: '10000', label: 'Below \u20b110,000' },
  { value: '15000', label: 'Below \u20b115,000' },
  { value: '20000', label: 'Below \u20b120,000' },
];

export const DEFAULT_COLIVING_FILTERS = { search: '', campus: '', gender: '', maxBudget: '' };

export default function CoLivingFilters({ filters, onChange, campuses = [] }) {
  const update = (key) => (e) => onChange({ ...filters, [key]: e.target.value });

  return (
    <div className="search-row">
      <div className="search-wrap">
        <SearchIcon />
        <input
          className="search-input"
          type="text"
          placeholder="Search universities, majors, or keywords…"
          value={filters.search}
          onChange={update('search')}
        />
      </div>

      <select className="filter-select" value={filters.campus} onChange={update('campus')}>
        <option value="">Any Campus</option>
        {campuses.map((campus) => (
          <option key={campus.id} value={campus.name}>{campus.name}</option>
        ))}
      </select>

      <select className="filter-select" value={filters.gender} onChange={update('gender')}>
        {GENDER_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>

      <select className="filter-select" value={filters.maxBudget} onChange={update('maxBudget')}>
        {BUDGET_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
