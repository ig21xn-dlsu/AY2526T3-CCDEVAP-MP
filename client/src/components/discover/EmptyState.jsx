import React from 'react';
import { EmptySearchIcon } from './icons';

export default function EmptyState({ message = 'No groups match your search. Try different keywords.' }) {
  return (
    <div className="empty" style={{ display: 'block' }}>
      <EmptySearchIcon />
      {message}
    </div>
  );
}
