import { PersonIcon, SchoolIcon } from './icons.jsx';
import LifestyleTags from './LifestyleTags.jsx';

export default function AboutYouCard({
  university,
  onUniversityChange,
  campusOptions,
  universityError,
  major,
  onMajorChange,
  lifestyleTagOptions,
  isTagSelected,
  onToggleTag,
}) {
  return (
    <section className="card" id="card-about">
      <div className="card__header">
        <span className="card__icon card__icon--amber">
          <PersonIcon />
        </span>
        <h2 className="card__title">About You</h2>
      </div>

      <div className="form-row">
        <div className="form-field">
          <label className="form-label" htmlFor="university">
            University
          </label>
          <div className="input-icon-wrap">
            <SchoolIcon className="input-icon" />
            <select
              className="form-input form-input--icon"
              id="university"
              value={university}
              onChange={(e) => onUniversityChange(e.target.value)}
              required
            >
              <option value="" disabled>
                Select your university
              </option>
              {(campusOptions ?? []).map((campus) => (
                <option key={campus} value={campus}>
                  {campus}
                </option>
              ))}
            </select>
          </div>
          {universityError && <p className="form-error">{universityError}</p>}
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="major">
            Major / Program
          </label>
          <input
            className="form-input"
            id="major"
            type="text"
            placeholder="e.g., Computer Science"
            value={major}
            onChange={(e) => onMajorChange(e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label">Lifestyle Highlights</label>
        <LifestyleTags options={lifestyleTagOptions} isSelected={isTagSelected} onToggle={onToggleTag} />
      </div>
    </section>
  );
}
