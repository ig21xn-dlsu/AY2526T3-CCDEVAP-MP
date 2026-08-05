import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GroupNav from '../components/group/GroupNav';
import Hero from '../components/group/Hero';
import BelowHero from '../components/group/BelowHero';
import VibeCard from '../components/group/VibeCard';
import ListingCard from '../components/group/ListingCard';
import PreferencesCard from '../components/group/PreferencesCard';
import StatsCard from '../components/group/StatsCard';
import ApplyModal from '../components/group/ApplyModal';
import ConfirmModal from '../components/ConfirmModal';
import { useAsync } from '../hook/useAsync';
import { useAuthContext } from '../hook/useAuthContext';
import { deleteGroup, fetchGroupById, fetchMyGroup } from '../api/padpalApi';
import '../stylesheets/padpal-group.css';

export default function GroupProfile() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const { data: group, loading, error } = useAsync(() => fetchGroupById(groupId), [groupId]);
  const { data: myGroup } = useAsync(fetchMyGroup, []);
  const { user } = useAuthContext();
  const currentUserId = user?._id ?? user?.id;
  const isOwner = group?.viewerRole === 'owner' || Boolean(currentUserId && group?.ownerId && String(group.ownerId) === String(currentUserId));
  const isMember = group?.viewerRole === 'member' || isOwner || Boolean(Array.isArray(group?.memberIds) && group.memberIds.some((memberId) => String(memberId) === String(currentUserId)));
  const canApply = !myGroup?.id;
  const applyDisabledMessage = myGroup?.id
    ? 'You are already part of a group'
    : null;

  async function handleDeleteGroup() {
    setDeleteLoading(true);
    setDeleteError('');
    try {
      await deleteGroup(group.id);
      navigate('/student-discover-communities');
    } catch (err) {
      setDeleteError(err?.message || 'Failed to delete this group.');
    } finally {
      setDeleteLoading(false);
      setDeleteOpen(false);
    }
  }

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
      <BelowHero
        members={group.members}
        onApplyClick={() => setModalOpen(true)}
        disabled={!canApply}
        disabledMessage={applyDisabledMessage}
      />

      {(group?.showGroupId || isMember || isOwner) ? (
        <div className="group-actions-row">
          <div className="group-id-note">
            Group ID: <code>{group.id}</code>
          </div>
          {isOwner ? (
            <div className="group-actions">
              <button
                type="button"
                className="group-action-btn group-action-btn--secondary"
                onClick={() => navigate(`/student-edit-group/${group.id}`)}
              >
                Edit Group
              </button>
              <button
                type="button"
                className="group-action-btn group-action-btn--danger"
                onClick={() => setDeleteOpen(true)}
              >
                Delete Group
              </button>
            </div>
          ) : null}
        </div>
      ) : null}

      {deleteError ? <p className="group-action-error">{deleteError}</p> : null}

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

      <ConfirmModal
        open={deleteOpen}
        title="Delete Group"
        message={`Are you sure you want to delete "${group.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deleteLoading}
        onConfirm={handleDeleteGroup}
        onCancel={() => setDeleteOpen(false)}
      />
    </>
  );
}
