import React from 'react';

export default function StatsCard({ budget, moveIn, lease }) {
  return (
    <div className="card">
      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-value">{budget}</div>
          <div className="stat-label">Target Budget/mo</div>
        </div>
        <div className="stat-box">
          <div className="stat-value">{moveIn}</div>
          <div className="stat-label">Move-in Date</div>
        </div>
        <div className="stat-box full">
          <div className="stat-value">{lease}</div>
          <div className="stat-label">Lease Length</div>
        </div>
      </div>
    </div>
  );
}
