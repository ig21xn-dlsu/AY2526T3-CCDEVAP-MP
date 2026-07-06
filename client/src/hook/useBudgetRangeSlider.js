import { useCallback, useEffect, useRef, useState } from 'react';

export function useBudgetRangeSlider({ min, max, step, initialMin, initialMax }) {
  const [valueMin, setValueMin] = useState(initialMin);
  const [valueMax, setValueMax] = useState(initialMax);
  const trackRef = useRef(null);

  useEffect(() => {
    setValueMin(initialMin);
    setValueMax(initialMax);
  }, [initialMin, initialMax]);

  const percentFor = useCallback(
    (value) => (max === min ? 0 : ((value - min) / (max - min)) * 100),
    [min, max]
  );

  const valueFromClientX = useCallback(
    (clientX) => {
      const track = trackRef.current;
      if (!track) return min;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      return Math.round((min + ratio * (max - min)) / step) * step;
    },
    [min, max, step]
  );

  const updateFromClientX = useCallback(
    (clientX, thumb) => {
      const raw = valueFromClientX(clientX);
      if (thumb === 'min') {
        setValueMin((prevMin) => Math.min(raw, valueMax - step));
      } else {
        setValueMax((prevMax) => Math.max(raw, valueMin + step));
      }
    },
    [valueFromClientX, valueMin, valueMax, step]
  );

  const nudge = useCallback(
    (thumb, direction) => {
      const delta = direction === 'increase' ? step : -step;
      if (thumb === 'min') {
        setValueMin((prev) => Math.min(Math.max(prev + delta, min), valueMax - step));
      } else {
        setValueMax((prev) => Math.max(Math.min(prev + delta, max), valueMin + step));
      }
    },
    [min, max, step, valueMin, valueMax]
  );

  return {
    trackRef,
    valueMin,
    valueMax,
    percentMin: percentFor(valueMin),
    percentMax: percentFor(valueMax),
    updateFromClientX,
    nudge,
  };
}
