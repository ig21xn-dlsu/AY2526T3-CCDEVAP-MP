import { Router } from 'express';
import mongoose from 'mongoose';
import { Group } from '../models/Group.js';
import {
  getFormConfig,
  getValidTagIds,
  VALID_GENDER_VALUES,
  BUDGET_BOUNDS,
  SPOTS_BOUNDS,
} from '../config/formConfig.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const groupsRouter = Router();

const CURRENCY_SYMBOL = '\u20b1'; // this is just a peso symbol

// escapes the regular expression special characters so free-text search can't break the query
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function formatBudgetRange(budget) {
  if (!budget) return '';
  return `${CURRENCY_SYMBOL}${budget.min.toLocaleString()}\u2013${CURRENCY_SYMBOL}${budget.max.toLocaleString()}`;
}

/**
 * Shapes a Group document for the Discover Communities "Co-Living Groups"
 * tab, matching what GroupCard.jsx / fetchCoLivingGroups() expect:
 * { id, name, school, budget, match, desc, tags, members, tab }
 *
 * NOTE: `match` (compatibility %) has no scoring logic yet — defaults to 0
 * rather than null so GroupCard doesn't render "null% Match".
 */
function toDiscoverCardShape(group) {
  const g = group.toJSON();
  return {
    id: g.id,
    name: g.groupName,
    school: g.university,
    budget: formatBudgetRange(g.budget),
    match: 0, // TODO: no compatibility algorithm defined yet
    desc: g.vibeDescription,
    tags: g.lifestyleTags,
    members: g.members ?? [],
    tab: 'coliving',
  };
}

/**
 * Shapes a Group document for the Group Profile page, matching
 * fetchGroupById()'s documented response shape.
 *
 * NOTE: `listing` and `preferences` will be empty/null until a group is
 * actually linked to a Listing and preferences are collected somewhere.
 */
function toProfileShape(group) {
  const g = group.toJSON();
  return {
    id: g.id,
    name: g.groupName,
    badge: g.badge || null,
    location: g.university || '',
    heroImg: g.heroImgUrl || null,
    members: g.members ?? [],
    vibe: g.vibeDescription,
    tags: g.lifestyleTags,
    listing: g.listing ?? null, // TODO: populate once listing linking exists
    preferences: g.preferences ?? [],
    budget: formatBudgetRange(g.budget),
    moveIn: g.moveInDate,
    lease: g.lease || null,
  };
}

/**
 * GET /groups/form-config
 * Matches fetchGroupFormConfig() in groupService.js exactly:
 * { lifestyleTags, genderPreferences, budget, spots }
 */
groupsRouter.get(
  '/form-config',
  asyncHandler(async (req, res) => {
    res.json(await getFormConfig());
  })
);

/**
 * GET /groups
 * Matches fetchCoLivingGroups() in padpalApi.js exactly.
 * Query params: search, campus, gender, maxBudget (all optional).
 * Returns an array shaped for GroupCard: see toDiscoverCardShape().
 */
groupsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { search, campus, gender, maxBudget } = req.query;
    const filter = {};

    if (search) {
      const regex = new RegExp(escapeRegex(String(search)), 'i');
      filter.$or = [
        { groupName: regex },
        { university: regex },
        { major: regex },
        { vibeDescription: regex },
      ];
    }

    if (campus) {
      filter.university = campus;
    }

    if (gender) {
      filter.genderPreference = gender;
    }

    if (maxBudget) {
      const max = Number(maxBudget);
      if (Number.isFinite(max)) {
        // group shows up if its budget is still under the cap the user selected.
        filter['budget.min'] = { $lte: max };
      }
    }

    const groups = await Group.find(filter).sort({ createdAt: -1 });
    res.json(groups.map(toDiscoverCardShape));
  })
);

groupsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      name: groupName,
      description: vibeDescription = '',
      university = '',
      major = '',
      lifestyleTagIds: lifestyleTags = [],
      budget = {},
      moveInDate = null,
      spotsNeeded: spots,
      genderPreference = null,
    } = req.body ?? {};

    const errors = {};
    const validTagIds = await getValidTagIds();
    const genderValue = genderPreference ?? '';

    if (!groupName || typeof groupName !== 'string' || !groupName.trim()) {
      errors.groupName = 'Group name is required.';
    } else if (groupName.length > 80) {
      errors.groupName = 'Group name must be 80 characters or fewer.';
    }

    if (!Array.isArray(lifestyleTags) || lifestyleTags.some((t) => !validTagIds.has(t))) {
      errors.lifestyleTags = 'One or more lifestyle tags are invalid.';
    }

    const budgetMin = Number(budget.min);
    const budgetMax = Number(budget.max);
    if (
      !Number.isFinite(budgetMin) ||
      !Number.isFinite(budgetMax) ||
      budgetMin < BUDGET_BOUNDS.min ||
      budgetMax > BUDGET_BOUNDS.max ||
      budgetMin > budgetMax
    ) {
      errors.budget = `Budget must be between ${BUDGET_BOUNDS.min} and ${BUDGET_BOUNDS.max}, with min <= max.`;
    }

    const spotsNum = Number(spots);
    if (!Number.isInteger(spotsNum) || spotsNum < SPOTS_BOUNDS.min || spotsNum > SPOTS_BOUNDS.max) {
      errors.spots = `Spots must be an integer between ${SPOTS_BOUNDS.min} and ${SPOTS_BOUNDS.max}.`;
    }

    if (!VALID_GENDER_VALUES.has(genderValue)) {
      errors.genderPreference = 'Invalid gender preference.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        message: 'Some fields need your attention.',
        errors,
      });
    }

    const created = await Group.create({
      groupName: groupName.trim(),
      vibeDescription,
      university,
      major,
      lifestyleTags,
      budget: { min: budgetMin, max: budgetMax },
      moveInDate,
      spots: spotsNum,
      genderPreference: genderValue,
    });

    res.status(201).json(created.toJSON());
  })
);

groupsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid group id.' });
    }

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    res.json(toProfileShape(group));
  })
);
