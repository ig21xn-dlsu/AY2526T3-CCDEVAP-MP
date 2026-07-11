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

    res.json(group.toJSON());
  })
);
