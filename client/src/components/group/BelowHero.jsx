import React from 'react';
import AvatarStack from '../AvatarStack';

export default function BelowHero({ members, onApplyClick }) {
  return (
    <div className="below-hero">
      <AvatarStack members={members} maxVisible={3} />
      <button id="btnApplyHero" className="btn-apply" onClick={onApplyClick}>
        Apply to Join
      </button>
    </div>
  );
}
