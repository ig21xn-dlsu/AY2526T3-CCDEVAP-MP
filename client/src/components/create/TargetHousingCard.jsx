import { ClockIcon, CalendarIcon } from './icons.jsx';
import BudgetRangeSlider from './BudgetRangeSlider.jsx';

export default function TargetHousingCard({
  budgetConfig,
  budgetSlider,
  moveInDate,
  onMoveInDateChange,
}) {
  return (
    <section className="card" id="card-housing">
      <div className="card__header">
        <span className="card__icon card__icon--teal">
          <ClockIcon />
        </span>
        <h2 className="card__title">Target Housing</h2>
      </div>

      <BudgetRangeSlider
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
    </section>
  );
}
