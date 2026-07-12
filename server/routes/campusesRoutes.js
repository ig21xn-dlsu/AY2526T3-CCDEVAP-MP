import { Router } from 'express';
import { Group } from '../models/Group.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const campusesRouter = Router();

// known campuses that were set in the ListingRoutes.js
const KNOWN_CAMPUSES = ['UPM', 'DLSU', 'ADMU', 'UST', 'UPD'];

/**
 * GET /campuses
 * Matches fetchCampuses() in padpalApi.js exactly: Array<{ id, name }>
 *
 * Combines the known campus list with any freeform `university` values
 * already used on existing groups, so a campus someone typed in when
 * creating a group still shows up as a usable filter option.
 */
campusesRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const usedUniversities = await Group.distinct('university');
    const names = new Set(
      [...KNOWN_CAMPUSES, ...usedUniversities.filter(Boolean)]
    );

    const campuses = Array.from(names)
      .sort()
      .map((name) => ({ id: name, name }));

    res.json(campuses);
  })
);
