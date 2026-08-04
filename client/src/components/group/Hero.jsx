import React from 'react';

function LocationIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Hero({ group }) {
  const heroImage = group.heroImg || group.listingImg || group.listing?.img || group.listingImage || '';

  return (
    <div className="hero">
      <img src={heroImage} alt={group.name} />
      <div className="hero-overlay" />
      <div className="hero-content">
        {group.badge && <div className="hero-badge">{group.badge}</div>}
        <h1 className="hero-title">{group.name}</h1>
        <div className="hero-location">
          <LocationIcon />
          <span>{group.location}</span>
        </div>
      </div>
    </div>
  );
}
