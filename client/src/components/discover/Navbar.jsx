import React from 'react';
import AvatarMenu from './AvatarMenu';
import { BellIcon, SavedIcon } from './icons';

export default function Navbar({ onYourGroupClick }) {
  return (
    <nav>
      <span className="nav-logo">PadPal</span>
      <div className="nav-right">
        <button className="nav-icon" aria-label="Notifications">
          <BellIcon />
        </button>
        <button className="nav-icon" aria-label="Saved">
          <SavedIcon />
        </button>
        <button className="btn-your-group" onClick={onYourGroupClick}>Your Group</button>
        <AvatarMenu />
      </div>
    </nav>
  );
}
