import React, { useEffect, useMemo, useState } from 'react';
import GroupNav from '../components/group/GroupNav';
import Hero from '../components/group/Hero';
import BelowHero from '../components/group/BelowHero';
import VibeCard from '../components/group/VibeCard';
import ListingCard from '../components/group/ListingCard';
import PreferencesCard from '../components/group/PreferencesCard';
import StatsCard from '../components/group/StatsCard';
import ApplyModal from '../components/group/ApplyModal';
import { useAsync } from '../hook/useAsync';
import { fetchGroupById } from '../api/padpalApi'; // added for when api is ready
import '../stylesheets/padpal-group.css';

function useGroupIdFromQuery() {
  return useMemo(() => new URLSearchParams(window.location.search).get('id'), []);
}

export default function GroupProfile() {
  const groupId = useGroupIdFromQuery();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: group, loading, error } = useAsync(() => fetchGroupById(groupId), [groupId]);

  useEffect(() => {
    document.title = group?.name ? `PadPal – ${group.name}` : 'PadPal – Group Profile';
  }, [group]);

  if (loading) {
    return (
      <>
        <GroupNav />
        <p style={{ padding: 48, textAlign: 'center' }}>Loading group…</p>
      </>
    );
  }

  if (error || !group) {
    return (
      <>
        <GroupNav />
        <p style={{ padding: 48, textAlign: 'center' }}>
          {error ? `Something went wrong: ${error.message}` : 'This group could not be found.'}
        </p>
      </>
    );
  }

  return (
    <>
      <GroupNav />
      <Hero group={group} />
      <BelowHero members={group.members} onApplyClick={() => setModalOpen(true)} />

      <div className="page-grid">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <VibeCard vibe={group.vibe} tags={group.tags} />
          <ListingCard listing={group.listing} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <PreferencesCard preferences={group.preferences} />
          <StatsCard budget={group.budget} moveIn={group.moveIn} lease={group.lease} />
        </div>
      </div>

      <ApplyModal
        open={modalOpen}
        groupId={group.id}
        groupName={group.name}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
