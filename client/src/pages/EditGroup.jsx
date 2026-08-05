import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CreateGroup from './CreateGroup';
import { useAsync } from '../hook/useAsync';
import { useAuthContext } from '../hook/useAuthContext';
import { fetchGroupById } from '../api/padpalApi';

export default function EditGroup() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { data: group, loading, error } = useAsync(() => fetchGroupById(groupId), [groupId]);

  useEffect(() => {
    document.title = group?.groupName ? `PadPal – Edit ${group.groupName}` : 'PadPal – Edit Group';
  }, [group]);

  if (loading) {
    return <p style={{ padding: 48, textAlign: 'center' }}>Loading group…</p>;
  }

  if (error || !group) {
    return (
      <p style={{ padding: 48, textAlign: 'center' }}>
        {error ? `Something went wrong: ${error.message}` : 'This group could not be found.'}
      </p>
    );
  }

  const currentUserId = user?._id ?? user?.id;
  const isOwner = group.viewerRole === 'owner' || (currentUserId && group.ownerId && String(group.ownerId) === String(currentUserId));

  if (!isOwner) {
    return (
      <p style={{ padding: 48, textAlign: 'center' }}>
        Only the group owner can edit this group.
      </p>
    );
  }

  return (
    <CreateGroup
      mode="edit"
      groupId={groupId}
      initialValues={{
        groupName: group.groupName ?? group.name ?? '',
        vibeDescription: group.vibeDescription ?? group.vibe ?? '',
        university: group.university ?? group.location ?? '',
        major: group.major ?? '',
        lifestyleTagIds: group.lifestyleTagIds ?? group.tags ?? [],
        budgetRange: group.budgetRange ?? null,
        moveInDate: group.moveInDate ?? group.moveIn ?? '',
        spots: group.spots ?? 1,
        genderPreference: group.genderPreference ?? '',
        listingId: group.listingId ?? group.listing?.id ?? '',
      }}
      onSuccess={() => navigate(`/student-group-profile/${groupId}`)}
    />
  );
}