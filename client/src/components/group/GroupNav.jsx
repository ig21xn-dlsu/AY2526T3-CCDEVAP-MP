import React from 'react';
import { useAsync } from '../../hook/useAsync';
import { fetchCurrentUser } from '../../api/padpalApi'; // api placeholder
import { BellIcon } from '../icons';

export default function GroupNav({ backHref = '/' }) {
  const { data: user } = useAsync(fetchCurrentUser, []);

  return (
    <nav>
      <div className="nav-left">
        <a href={backHref} className="btn-back">← Back</a>
        <span className="nav-logo">PadPal</span>
      </div>
      <div className="nav-right">
        <button className="nav-icon" aria-label="Notifications">
          <BellIcon />
        </button>
        <div className="avatar-nav">
          {user?.avatarUrl && <img src={user.avatarUrl} alt={user.name || 'Profile'} />}
        </div>
      </div>
    </nav>
  );
}
