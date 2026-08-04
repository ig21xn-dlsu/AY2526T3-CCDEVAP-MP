import { ClockIcon, CalendarIcon, ChevronDownIcon } from './icons.jsx';
import BudgetRangerSlider from './BudgetRangerSlider.jsx';

export default function TargetHousingCard({
  budgetConfig,
  budgetSlider,
  moveInDate,
  onMoveInDateChange,
  listingOptions = [],
  selectedListingId,
  onListingChange,
}) {
  return (
    <section className="card" id="card-housing">
      <div className="card__header">
        <span className="card__icon card__icon--teal">
          <ClockIcon />
        </span>
        <h2 className="card__title">Target Housing</h2>
      </div>

      <BudgetRangerSlider
        min={budgetConfig.min}
        max={budgetConfig.max}
        step={budgetConfig.step}
        currencySymbol={budgetConfig.currencySymbol}
        slider={budgetSlider}
      />

      <div className="form-field">
        <label className="form-label" htmlFor="move-in-date">
          Target Move-in Date
        </label>
        <div className="input-icon-wrap">
          <CalendarIcon className="input-icon" />
          <input
            className="form-input form-input--icon"
            id="move-in-date"
            type="date"
            value={moveInDate}
            onChange={(e) => onMoveInDateChange(e.target.value)}
          />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="eyeing-listing">
          Listing They&apos;re Eyeing
        </label>
        <p className="form-hint">Link a listing your group is currently considering.</p>
        <div className="select-wrap">
          <select
            className="form-select"
            id="eyeing-listing"
            value={selectedListingId ?? ''}
            onChange={(e) => onListingChange(e.target.value)}
          >
            <option value="">No listing selected</option>
            {(listingOptions ?? []).map((listing) => {
              const optionValue = listing.id ?? listing._id;
              const optionLabel = listing.name || listing.roomTitle || 'Untitled listing';
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                  {listing.nearestCampus ? ` • ${listing.nearestCampus}` : ''}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className="select-chevron" />
        </div>
      </div>
    </section>
  );
}
