import React from 'react';
import AvatarStack from '../discover/AvatarStack';

export default function BelowHero({ members, onApplyClick, disabled = false, disabledMessage }) {
  return (
    <div className="below-hero">
      <AvatarStack members={members} maxVisible={3} />
      <button
        id="btnApplyHero"
        className="btn-apply"
        onClick={!disabled ? onApplyClick : undefined}
        disabled={disabled}
        aria-disabled={disabled}
      >
        {disabled ? 'Already in a group' : 'Apply to Join'}
      </button>
      {disabledMessage ? (
        <p style={{ marginTop: 10, color: '#6b7280', fontSize: '0.95rem' }}>{disabledMessage}</p>
      ) : null}
    </div>
  );
}
