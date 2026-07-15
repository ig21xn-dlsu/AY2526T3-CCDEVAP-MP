import React from 'react';
import { useAsync } from '../../hook/useAsync';
import { fetchCurrentUser } from '../../api/padpalApi'; // api placeholder
import { BellIcon } from '../discover/icons';
import { NavLink } from 'react-router-dom';

export default function GroupNav({ backHref = '/' }) {
  const { data: user } = useAsync(fetchCurrentUser, []);

  return (
    <nav>
      <div className="nav-left">
        <NavLink to="/student-discover-communities" className="btn-back">
          ← Back to Discover Communities
        </NavLink>
      </div>
    </nav>
  );
}
