import { useEffect, useState } from 'react';
import TopNav from '../components/create/TopNav.jsx';
import PageHeader from '../components/create/PageHeader.jsx';
import GroupIdentityCard from '../components/create/GroupIdentityCard.jsx';
import AboutYouCard from '../components/create/AboutYouCard.jsx';
import TargetHousingCard from '../components/create/TargetHousingCard.jsx';
import DesiredRoommatesCard from '../components/create/DesiredRoommatesCard.jsx';
import LaunchButton from '../components/create/LaunchButton.jsx';

import { fetchAvailableListings } from '../api/groupService.js';
import { useGroupFormConfig } from '../hook/useGroupFormConfig.js';
import { useCreateGroupForm } from '../hook/useCreateGroupForm.js';

import '../stylesheets/create-group.css';

const NO_PREFERENCE_OPTION = { value: '', label: 'No preference' };

export default function CreateGroup({ onSuccess, mode = 'create', groupId = null, initialValues = {} }) {
  const { config, status: configStatus, error: configError, isLoading } = useGroupFormConfig();
  const [listingOptions, setListingOptions] = useState([]);
  const isEditMode = mode === 'edit';

  // Called unconditionally (before any early return) to satisfy the Rules of Hooks.
  // If useCreateGroupForm reads into `config` immediately (e.g. config.budget) on
  // every render, make sure it can tolerate `config` being undefined/partial while
  // the form config is still loading.
  const {
    fields,
    lifestyleTags,
    budgetSlider,
    fieldErrors,
    submitStatus,
    submitError,
    submit,
  } = useCreateGroupForm(config, onSuccess, initialValues, mode, groupId);

  useEffect(() => {
    let cancelled = false;

    async function loadListings() {
      try {
        const data = await fetchAvailableListings();
        if (!cancelled) {
          setListingOptions(Array.isArray(data) ? data : []);
        }
      } catch {
        if (!cancelled) {
          setListingOptions([]);
        }
      }
    }

    loadListings();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <TopNav label={isEditMode ? 'SETTINGS' : 'SETUP'} backLabel={isEditMode ? 'Group Profile' : 'Discover Communities'} backHref={isEditMode && groupId ? `/student-group-profile/${groupId}` : '/student-discover-communities'} />
        <PageHeader
          title={isEditMode ? 'Edit Your Group' : 'Create a Group'}
          subtitle="Loading the form, one moment…"
        />
      </div>
    );
  }

  if (configStatus === 'error') {
    return (
      <div className="page-wrapper">
        <TopNav label={isEditMode ? 'SETTINGS' : 'SETUP'} backLabel={isEditMode ? 'Group Profile' : 'Discover Communities'} backHref={isEditMode && groupId ? `/student-group-profile/${groupId}` : '/student-discover-communities'} />
        <PageHeader title={isEditMode ? 'Edit Your Group' : 'Create a Group'} subtitle="We couldn't load this form." />
        <p className="form-hint" style={{ color: '#EF4444' }}>
          {configError?.message ?? 'Something went wrong loading the form. Please refresh and try again.'}
        </p>
      </div>
    );
  }

  const genderOptions = [NO_PREFERENCE_OPTION, ...config.genderPreferences];

  async function handleLaunch() {
    await submit();
  }

  return (
    <div className="page-wrapper">
      <TopNav label={isEditMode ? 'SETTINGS' : 'SETUP'} backLabel={isEditMode ? 'Group Profile' : 'Discover Communities'} backHref={isEditMode && groupId ? `/student-group-profile/${groupId}` : '/student-discover-communities'} />

      <PageHeader
        title={isEditMode ? 'Edit Your Group' : 'Create a Group'}
        subtitle={isEditMode
          ? 'Update the details your group shares with prospective roommates.'
          : "Tell future roommates who you are, what you're looking for, and where you want to live."}
      />

      <div className="main-grid">
        <div className="col-left">
          <GroupIdentityCard
            groupName={fields.groupName}
            onGroupNameChange={fields.setGroupName}
            vibeDescription={fields.vibeDescription}
            onVibeDescriptionChange={fields.setVibeDescription}
            error={fieldErrors.groupName}
          />

          <AboutYouCard
            university={fields.university}
            onUniversityChange={fields.setUniversity}
            campusOptions={config.campuses}
            universityError={fieldErrors.university}
            major={fields.major}
            onMajorChange={fields.setMajor}
            lifestyleTagOptions={config.lifestyleTags}
            isTagSelected={lifestyleTags.isSelected}
            onToggleTag={lifestyleTags.toggleTag}
          />
        </div>

        <div className="col-right">
          <TargetHousingCard
            budgetConfig={config.budget}
            budgetSlider={budgetSlider}
            moveInDate={fields.moveInDate}
            onMoveInDateChange={fields.setMoveInDate}
            listingOptions={listingOptions}
            selectedListingId={fields.selectedListingId}
            onListingChange={fields.setSelectedListingId}
          />

          <DesiredRoommatesCard
            spots={fields.spots}
            spotsConfig={config.spots}
            onIncrementSpots={fields.incrementSpots}
            onDecrementSpots={fields.decrementSpots}
            genderPreference={fields.genderPreference}
            genderOptions={genderOptions}
            onGenderPreferenceChange={fields.setGenderPreference}
          />
        </div>
      </div>

      <LaunchButton status={submitStatus} onClick={handleLaunch} mode={isEditMode ? 'edit' : 'create'} />

      {submitStatus === 'error' && submitError && (
        <p className="cta-hint" style={{ color: '#EF4444' }}>
          {submitError}
        </p>
      )}
      {!isEditMode && submitStatus === 'idle' && (
        <p className="cta-hint">You can edit these details later from your group settings.</p>
      )}
    </div>
  );
}