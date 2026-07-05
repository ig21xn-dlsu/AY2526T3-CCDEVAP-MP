import React from 'react';

function VibeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function VibeCard({ vibe, tags = [] }) {
  return (
    <div className="card">
      <div className="card-title">
        <VibeIcon />
        Our Vibe
      </div>
      <p className="vibe-desc">{vibe}</p>
      <div className="tags">
        {tags.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
