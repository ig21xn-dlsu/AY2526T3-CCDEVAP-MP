import { GroupIcon } from './icons.jsx';

export default function GroupIdentityCard({
  groupName,
  onGroupNameChange,
  vibeDescription,
  onVibeDescriptionChange,
  error,
}) {
  return (
    <section className="card" id="card-identity">
      <div className="card__header">
        <span className="card__icon">
          <GroupIcon />
        </span>
        <h2 className="card__title">Group Identity</h2>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="group-name">
          Group Name
        </label>
        <input
          className="form-input"
          id="group-name"
          type="text"
          placeholder="e.g., The Tech Campus Crew"
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
          style={error ? { borderColor: '#EF4444' } : undefined}
        />
        {error && <p className="form-hint" style={{ color: '#EF4444' }}>{error}</p>}
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="vibe-desc">
          Vibe &amp; Description
          <span className="form-label__opt">Optional</span>
        </label>
        <textarea
          className="form-textarea"
          id="vibe-desc"
          rows={4}
          placeholder="Describe the atmosphere you want. Are you all about focused study sessions, weekend hikes, or hosting game nights?"
          value={vibeDescription}
          onChange={(e) => onVibeDescriptionChange(e.target.value)}
        />
      </div>
    </section>
  );
}
