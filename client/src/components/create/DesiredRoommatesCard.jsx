import { TwoPeopleIcon, ChevronDownIcon } from './icons.jsx';
import Stepper from './Stepper.jsx';

export default function DesiredRoommatesCard({
  spots,
  spotsConfig,
  onIncrementSpots,
  onDecrementSpots,
  genderPreference,
  genderOptions,
  onGenderPreferenceChange,
}) {
  return (
    <section className="card" id="card-roommates">
      <div className="card__header">
        <span className="card__icon card__icon--amber">
          <TwoPeopleIcon />
        </span>
        <h2 className="card__title">Desired Roommates</h2>
      </div>

      <div className="form-field">
        <label className="form-label">Spots Needed</label>
        <p className="form-hint">How many people to add?</p>
        <Stepper
          value={spots}
          onIncrement={onIncrementSpots}
          onDecrement={onDecrementSpots}
          min={spotsConfig.min}
          max={spotsConfig.max}
        />
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="gender-pref">
          Gender Preference
        </label>
        <div className="select-wrap">
          <select
            className="form-select"
            id="gender-pref"
            value={genderPreference}
            onChange={(e) => onGenderPreferenceChange(e.target.value)}
          >
            {genderOptions.map((option) => (
              <option key={option.value || 'none'} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="select-chevron" />
        </div>
      </div>
    </section>
  );
}
