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
  const [spots, setSpots] = useState(config?.spots?.default ?? 1);
  const [genderPreference, setGenderPreference] = useState('');
  const [selectedListingId, setSelectedListingId] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'
  const [submitError, setSubmitError] = useState(null);

  const { selectedIds: lifestyleTagIds, toggleTag, isSelected } = useLifestyleTags();
  const budgetConfig = config?.budget ?? {};
  const spotsConfig = config?.spots ?? {};

  const budgetSlider = useBudgetRangeSlider({
    min: budgetConfig.min ?? 0,
    max: budgetConfig.max ?? 0,
    step: budgetConfig.step ?? 500,
    initialMin: budgetConfig.defaultMin ?? 0,
    initialMax: budgetConfig.defaultMax ?? 0,
  });

  const incrementSpots = useCallback(() => {
    setSpots((prev) => Math.min(prev + 1, spotsConfig.max ?? 6));
  }, [spotsConfig.max]);

  const decrementSpots = useCallback(() => {
    setSpots((prev) => Math.max(prev - 1, spotsConfig.min ?? 1));
  }, [spotsConfig.min]);

  const validate = useCallback(() => {
    const errors = {};
    if (!groupName.trim()) {
      errors.groupName = 'Give your group a name.';
    }
    if (!university) {
      errors.university = 'Please select a university.';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [groupName, university]);

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
      listingId: selectedListingId || null,
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
      selectedListingId,
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
      selectedListingId,
      setSelectedListingId,
    },
    lifestyleTags: { selectedIds: lifestyleTagIds, toggleTag, isSelected },
    budgetSlider,
    fieldErrors,
    submitStatus,
    submitError,
    submit,
  };
}
