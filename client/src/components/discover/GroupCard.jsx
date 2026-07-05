import React from 'react';
import AvatarStack from './AvatarStack';
import { SchoolIcon, CheckIcon, PinIcon } from './icons';

export default function GroupCard({ item }) {
  const isShared = item.tab === 'shared';

 // determines where they should be redirected when "view" is clicked
  const viewHref = isShared ? `/listings/${item.id}` : `/groups/${item.id}`;

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title-block">
          <div className="card-name">{item.name}</div>
          <div className="card-school">
            <SchoolIcon />
            {item.school}
          </div>
        </div>
        <div className="match-badge">
          <CheckIcon />
          {item.match}% Match
        </div>
      </div>

      {isShared ? (
        <div>
          <div className="space-price">{item.price}</div>
          <div className="space-addr">
            <PinIcon />
            {item.address}
          </div>
        </div>
      ) : (
        <AvatarStack members={item.members} />
      )}

      <p className="card-desc">{item.desc}</p>

      <div className="card-tags">
        {item.tags.map((tag) => (
          <span className="tag" key={tag}>{tag}</span>
        ))}
      </div>

      <a className="btn-view" href={viewHref}>
        {isShared ? 'View Listing' : 'View Group Profile'}
      </a>
    </div>
  );
}
