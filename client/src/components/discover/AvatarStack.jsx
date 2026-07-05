import React, { useState } from 'react';

const DEFAULT_MAX_VISIBLE = 2;

function Avatar({ member }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = Boolean(member.imgUrl) && !imgFailed;

  return (
    <div className="av" style={!showImage ? { background: member.color, color: '#fff' } : undefined}>
      {showImage ? (
        <img src={member.imgUrl} alt={member.initials} loading="lazy" onError={() => setImgFailed(true)} />
      ) : (
        member.initials
      )}
    </div>
  );
}

export default function AvatarStack({ members = [], maxVisible = DEFAULT_MAX_VISIBLE }) {
  if (!members.length) return <div className="avatar-stack" />;

  const visible = members.slice(0, maxVisible);
  const overflow = members.length - maxVisible;

  return (
    <div className="avatar-stack">
      {visible.map((member, i) => (
        <Avatar key={member.id ?? i} member={member} />
      ))}
      {overflow > 0 && <div className="av av-overflow">+{overflow}</div>}
    </div>
  );
}
