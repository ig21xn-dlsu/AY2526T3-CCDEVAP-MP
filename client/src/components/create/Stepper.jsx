export default function Stepper({ value, onIncrement, onDecrement, min, max }) {
  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper__btn"
        id="spots-dec"
        aria-label="Decrease spots"
        onClick={onDecrement}
        disabled={value <= min}
      >
        &#8722;
      </button>
      <span className="stepper__val" id="spots-val">
        {value}
      </span>
      <button
        type="button"
        className="stepper__btn"
        id="spots-inc"
        aria-label="Increase spots"
        onClick={onIncrement}
        disabled={value >= max}
      >
        &#43;
      </button>
    </div>
  );
}
