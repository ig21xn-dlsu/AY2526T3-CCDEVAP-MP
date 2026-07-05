import React from 'react';

function ListingIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function ListingCard({ listing }) {
  if (!listing) return null;

  return (
    <div className="card">
      <div className="card-title">
        <ListingIcon />
        Eyeing This Space
      </div>
      <div className="listing">
        <img className="listing-img" src={listing.img} alt={listing.name} />
        <div className="listing-body">
          <div className="listing-name">{listing.name}</div>
          <div className="listing-meta">
            <PinIcon />
            <span>{listing.meta}</span>
          </div>
          <p className="listing-desc">{listing.desc}</p>
          <a href={listing.url || '#'} className="listing-link">
            View Listing
            <ArrowRightIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
