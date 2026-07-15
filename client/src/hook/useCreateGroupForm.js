import { useCallback, useState } from 'react';
import { createGroup, ApiError } from '../api/groupService.js'; // api placeholder
import { useLifestyleTags } from './useLifestyleTags.js';
import { useBudgetRangeSlider } from './useBudgetRangeSlider.js';

export function useCreateGroupForm(config, onSuccess) {
  const [groupName, setGroupName] = useState('');
  const [vibeDescription, setVibeDescription] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [moveInDate, setMoveInDate] = useState('');
  const [spots, setSpots] = useState(config.spots.default);
  const [genderPreference, setGenderPreference] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [submitError, setSubmitError] = useState(null);

  const { selectedIds: lifestyleTagIds, toggleTag, isSelected } = useLifestyleTags();

  const budgetSlider = useBudgetRangeSlider({
    min: config.budget.min,
    max: config.budget.max,
    step: config.budget.step,
    initialMin: config.budget.defaultMin,
    initialMax: config.budget.defaultMax,
  });

  const incrementSpots = useCallback(() => {
    setSpots((prev) => Math.min(prev + 1, config.spots.max));
  }, [config.spots.max]);

  const decrementSpots = useCallback(() => {
    setSpots((prev) => Math.max(prev - 1, config.spots.min));
  }, [config.spots.min]);

  const validate = useCallback(() => {
    const errors = {};
    if (!groupName.trim()) {
      errors.groupName = 'Give your group a name.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [groupName]);

  const buildPayload = useCallback(
    () => ({
      name: groupName.trim(),
      description: vibeDescription.trim(),
      university: university.trim(),
      major: major.trim(),
      lifestyleTagIds,
      budget: {
        min: budgetSlider.valueMin,
        max: budgetSlider.valueMax,
      },
      moveInDate: moveInDate || null,
      spotsNeeded: spots,
      genderPreference: genderPreference || null,
    }),
    [
      groupName,
      vibeDescription,
      university,
      major,
      lifestyleTagIds,
      budgetSlider.valueMin,
      budgetSlider.valueMax,
      moveInDate,
      spots,
      genderPreference,
    ]
  );

  const submit = useCallback(async () => {
    if (!validate()) return { ok: false };

    setSubmitStatus('submitting');
    setSubmitError(null);

    let created;
    try {
      created = await createGroup(buildPayload());
    } catch (err) {
      setSubmitStatus('error');
      setSubmitError(
        err instanceof ApiError ? err.message : 'Something went wrong. Please try again.'
      );
      return { ok: false, error: err };
    }

    setSubmitStatus('success');
    onSuccess?.(created); // outside try/catch — a navigation error won't be mislabeled as a submit failure
    return { ok: true, data: created };
  }, [validate, buildPayload, onSuccess]);

  return {
    fields: {
      groupName,
      setGroupName,
      vibeDescription,
      setVibeDescription,
      university,
      setUniversity,
      major,
      setMajor,
      moveInDate,
      setMoveInDate,
      spots,
      incrementSpots,
      decrementSpots,
      genderPreference,
      setGenderPreference,
    },
    lifestyleTags: { selectedIds: lifestyleTagIds, toggleTag, isSelected },
    budgetSlider,
    fieldErrors,
    submitStatus,
    submitError,
    submit,
  };
}
