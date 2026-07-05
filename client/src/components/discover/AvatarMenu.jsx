import React, { useEffect, useRef, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { fetchCurrentUser } from '../api/padpalApi';
import { ProfileIcon, SettingsIcon, LogoutIcon, ProfileAvatarGlyph } from './icons';

export default function AvatarMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const { data: user } = useAsync(fetchCurrentUser, []);

  useEffect(() => {
    function handleClick(e) {
      const clickedOutside =
        menuRef.current && !menuRef.current.contains(e.target) &&
        btnRef.current && !btnRef.current.contains(e.target);
      if (clickedOutside) setOpen(false);
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="avatar-menu">
      <button
        ref={btnRef}
        id="avatar-btn"
        className="avatar-nav"
        aria-label="Profile Menu"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <ProfileAvatarGlyph />
      </button>

      <div ref={menuRef} className={`dropdown${open ? ' open' : ''}`} role="menu" aria-hidden={!open}>
        <div className="dropdown-profile">
          {user?.avatarUrl && (
            <img src={user.avatarUrl} alt={user.name} className="dropdown-avatar" />
          )}
          <div className="dropdown-info">
            <span className="dropdown-name">{user?.name ?? 'Loading…'}</span>
            <span className="dropdown-email">{user?.email ?? ''}</span>
          </div>
        </div>

        <div className="dropdown-divider" />

        <a className="dropdown-item" href="/profile" role="menuitem">
          <span className="item-icon"><ProfileIcon /></span>
          <span>Profile</span>
        </a>

        <a className="dropdown-item" href="/settings" role="menuitem">
          <span className="item-icon"><SettingsIcon /></span>
          <span>Settings</span>
        </a>

        <div className="dropdown-divider" />

        <a className="dropdown-item logout" href="/logout" role="menuitem">
          <span className="item-icon"><LogoutIcon /></span>
          <span>Logout</span>
        </a>
      </div>
    </div>
  );
}
