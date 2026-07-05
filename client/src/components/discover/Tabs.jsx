import React from 'react';

const TABS = [
  { id: 'coliving', label: 'Co-Living Groups' },
  { id: 'shared', label: 'Shared Spaces' },
];

export default function Tabs({ activeTab, onChange }) {
  return (
    <div className="tabs" role="tablist">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={`tab${activeTab === tab.id ? ' active' : ''}`}
          role="tab"
          aria-selected={activeTab === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
