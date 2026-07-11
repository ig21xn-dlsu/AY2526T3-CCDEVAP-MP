import { LifestyleTag } from '../models/LifestyleTag.js';

// this seeds into mongoDB
const DEFAULT_TAGS = [
  { _id: 'early_bird', label: 'Early Bird', icon: '🌅' },
  { _id: 'night_owl', label: 'Night Owl', icon: '🌙' },
  { _id: 'clean_freak', label: 'Clean Freak', icon: '🧼' },
  { _id: 'pet_friendly', label: 'Pet Friendly', icon: '🐾' },
  { _id: 'non_smoker', label: 'Non-Smoker', icon: '🚭' },
  { _id: 'studious', label: 'Studious', icon: '📚' },
  { _id: 'social', label: 'Social / Outgoing', icon: '🎉' },
  { _id: 'quiet', label: 'Prefers Quiet', icon: '🤫' },
];

export async function seedLifestyleTags() {
  const ops = DEFAULT_TAGS.map((tag) => ({
    updateOne: {
      filter: { _id: tag._id },
      update: { $setOnInsert: tag },
      upsert: true,
    },
  }));
  await LifestyleTag.bulkWrite(ops);
}

const GENDER_PREFERENCES = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'coed', label: 'Co-ed' },
];

const BUDGET = {
  min: 3000,
  max: 30000,
  step: 500,
  defaultMin: 5000,
  defaultMax: 15000,
  currencySymbol: '₱',
};

const SPOTS = {
  min: 1,
  max: 6,
  default: 2,
};

export async function getFormConfig() {
  const tags = await LifestyleTag.find().sort({ _id: 1 }).lean();

  return {
    lifestyleTags: tags.map((t) => ({ id: t._id, label: t.label, icon: t.icon })),
    genderPreferences: GENDER_PREFERENCES,
    budget: BUDGET,
    spots: SPOTS,
  };
}

export async function getValidTagIds() {
  const ids = await LifestyleTag.distinct('_id');
  return new Set(ids);
}

export const VALID_GENDER_VALUES = new Set(['', ...GENDER_PREFERENCES.map((g) => g.value)]);
export const BUDGET_BOUNDS = BUDGET;
export const SPOTS_BOUNDS = SPOTS;
