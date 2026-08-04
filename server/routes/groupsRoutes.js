const { Router } = require('express');
const mongoose = require('mongoose');
const Group = require('../models/Group.js');
const Listing = require('../models/Listing.js');
const {
  getFormConfig,
  getValidTagIds,
  VALID_GENDER_VALUES,
  VALID_CAMPUSES,
  BUDGET_BOUNDS,
  SPOTS_BOUNDS,
} = require('../config/formConfigs.js');
const { asyncHandler } = require('../utils/asyncHandler.js');

const groupsRouter = Router();

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
  const listing = group.listing;
  const listingImage = listing?.imageUrl
    ? (Array.isArray(listing.imageUrl) ? listing.imageUrl[0] : listing.imageUrl)
    : null;

  return {
    id: g.id,
    name: g.groupName,
    school: g.university,
    budget: formatBudgetRange(g.budget),
    match: 0, // TODO: no compatibility algorithm defined yet
    desc: g.vibeDescription,
    tags: g.lifestyleTags,
    members: g.members ?? [],
    heroImg: g.heroImgUrl || listingImage || null,
    listingImage,
    listingName: listing?.roomTitle || null,
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
  const listingImage = group.listing?.imageUrl
    ? (Array.isArray(group.listing.imageUrl) ? group.listing.imageUrl[0] : group.listing.imageUrl)
    : null;
  const listing = group.listing
    ? {
        id: group.listing._id ? group.listing._id.toString() : group.listing.toString(),
        img: listingImage,
        name: group.listing.roomTitle || 'Listing',
        meta: [group.listing.buildingName, group.listing.nearestCampus].filter(Boolean).join(' • '),
        desc: group.listing.description || '',
        url: `/listings/${group.listing._id ? group.listing._id.toString() : group.listing.toString()}`,
      }
    : null;

  return {
    id: g.id,
    name: g.groupName,
    badge: g.badge || null,
    location: g.university || '',
    heroImg: g.heroImgUrl || listingImage || null,
    members: g.members ?? [],
    vibe: g.vibeDescription,
    tags: g.lifestyleTags,
    listing,
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

    const groups = await Group.find(filter).populate('listing').sort({ createdAt: -1 });
    res.json(groups.map(toDiscoverCardShape));
  })
);

groupsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const {
      name: groupName,
      description: vibeDescription = '',
      university,
      major = '',
      lifestyleTagIds: lifestyleTags = [],
      budget = {},
      moveInDate = null,
      spotsNeeded: spots,
      genderPreference = null,
      listingId: selectedListingId,
      listing: linkedListing,
    } = req.body ?? {};

    const errors = {};
    const validTagIds = await getValidTagIds();
    const genderValue = genderPreference ?? '';
    const normalizedListingId = typeof selectedListingId === 'string'
      ? selectedListingId.trim()
      : selectedListingId ?? linkedListing ?? null;

    if (!groupName || typeof groupName !== 'string' || !groupName.trim()) {
      errors.groupName = 'Group name is required.';
    } else if (groupName.length > 80) {
      errors.groupName = 'Group name must be 80 characters or fewer.';
    }

    if (!Array.isArray(lifestyleTags) || lifestyleTags.some((t) => !validTagIds.has(t))) {
      errors.lifestyleTags = 'One or more lifestyle tags are invalid.';
    }

    if (!university || typeof university !== 'string' || !VALID_CAMPUSES.has(university)) {
      errors.university = 'Please select a valid university.';
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

    let linkedListingDoc = null;
    if (normalizedListingId) {
      if (!mongoose.isValidObjectId(normalizedListingId)) {
        errors.listing = 'Please choose a valid listing.';
      } else {
        linkedListingDoc = await Listing.findById(normalizedListingId);
        if (!linkedListingDoc || linkedListingDoc.isDeleted) {
          errors.listing = 'That listing could not be found.';
        }
      }
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
      listing: linkedListingDoc ? linkedListingDoc._id : null,
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

    const group = await Group.findById(req.params.id).populate('listing');
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    res.json(toProfileShape(group));
  })
);

module.exports = groupsRouter;
