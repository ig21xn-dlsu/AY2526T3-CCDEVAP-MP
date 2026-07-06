import { useEffect, useRef } from 'react';

function formatCurrency(value, symbol) {
  return `${symbol}${value.toLocaleString()}`;
}

export default function BudgetRangeSlider({
  min,
  max,
  step,
  currencySymbol,
  slider, // return value of useBudgetRangeSlider
}) {
  const { trackRef, valueMin, valueMax, percentMin, percentMax, updateFromClientX, nudge } = slider;
  const draggingThumb = useRef(null);

  useEffect(() => {
    function onMove(e) {
      if (!draggingThumb.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX, draggingThumb.current);
    }
    function onUp() {
      draggingThumb.current = null;
    }

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchmove', onMove, { passive: false });
    document.addEventListener('touchend', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove);
      document.removeEventListener('touchend', onUp);
    };
  }, [updateFromClientX]);

  function startDrag(thumb) {
    draggingThumb.current = thumb;
  }

  function handleKeyDown(thumb, e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nudge(thumb, 'increase');
      e.preventDefault();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nudge(thumb, 'decrease');
      e.preventDefault();
    }
  }

  return (
    <div className="form-field">
      <div className="range-header">
        <label className="form-label" htmlFor="budget-range">
          Budget Range (per person)
        </label>
        <span className="range-value" id="budget-display">
          {formatCurrency(valueMin, currencySymbol)} – {formatCurrency(valueMax, currencySymbol)}
        </span>
      </div>
      <div className="range-track-wrap">
        <div className="range-track" ref={trackRef}>
          <div
            className="range-fill"
            id="range-fill"
            style={{ left: `${percentMin}%`, width: `${percentMax - percentMin}%` }}
          />
          <div
            className="range-thumb"
            id="thumb-min"
            tabIndex={0}
            role="slider"
            aria-label="Minimum budget"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={valueMin}
            style={{ left: `${percentMin}%` }}
            onMouseDown={() => startDrag('min')}
            onTouchStart={() => startDrag('min')}
            onKeyDown={(e) => handleKeyDown('min', e)}
          />
          <div
            className="range-thumb"
            id="thumb-max"
            tabIndex={0}
            role="slider"
            aria-label="Maximum budget"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={valueMax}
            style={{ left: `${percentMax}%` }}
            onMouseDown={() => startDrag('max')}
            onTouchStart={() => startDrag('max')}
            onKeyDown={(e) => handleKeyDown('max', e)}
          />
        </div>
      </div>
    </div>
  );
}
