import TopNav from '../components/create/TopNav.jsx';
import PageHeader from '../components/create/PageHeader.jsx';
import GroupIdentityCard from '../components/create/GroupIdentityCard.jsx';
import AboutYouCard from '../components/create/AboutYouCard.jsx';
import TargetHousingCard from '../components/create/TargetHousingCard.jsx';
import DesiredRoommatesCard from '../components/create/DesiredRoommatesCard.jsx';
import LaunchButton from '../components/create/LaunchButton.jsx';

import { useGroupFormConfig } from '../hook/useGroupFormConfig.js';
import { useCreateGroupForm } from '../hook/useCreateGroupForm.js';

import '../stylesheets/create-group.css';

  if (isLoading) {
    return (
      <div className="page-wrapper">
        <TopNav label="SETUP" backLabel="Discover Communities" />
        <PageHeader
          title="Create a Group"
          subtitle="Loading the form, one moment…"
        />
      </div>
    );
  }

  if (configStatus === 'error') {
    return (
      <div className="page-wrapper">
        <TopNav label="SETUP" backLabel="Discover Communities" />
        <PageHeader title="Create a Group" subtitle="We couldn't load this form." />
        <p className="form-hint" style={{ color: '#EF4444' }}>
          {configError?.message ?? 'Something went wrong loading the form. Please refresh and try again.'}
        </p>
      </div>
    );
  }

const NO_PREFERENCE_OPTION = { value: '', label: 'No preference' };

export default function CreateGroup({ onSuccess }) {
  const { config, status: configStatus, error: configError, isLoading } = useGroupFormConfig();

  const {
    fields,
    lifestyleTags,
    budgetSlider,
    fieldErrors,
    submitStatus,
    submitError,
    submit,
  } = useCreateGroupForm(config, onSuccess);

  const genderOptions = [NO_PREFERENCE_OPTION, ...config.genderPreferences];

  async function handleLaunch() {
    await submit();
  }


  return (
    <div className="page-wrapper">
      <TopNav label="SETUP" backLabel="Discover Communities" />

      <PageHeader
        title="Create a Group"
        subtitle="Tell future roommates who you are, what you're looking for, and where you want to live."
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

      <LaunchButton status={submitStatus} onClick={handleLaunch} />

      {submitStatus === 'error' && submitError && (
        <p className="cta-hint" style={{ color: '#EF4444' }}>
          {submitError}
        </p>
      )}
      {submitStatus === 'idle' && (
        <p className="cta-hint">You can edit these details later from your group settings.</p>
      )}
    </div>
  );
}
