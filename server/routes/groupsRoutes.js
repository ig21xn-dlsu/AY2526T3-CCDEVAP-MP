const { Router } = require('express');
const mongoose = require('mongoose');
const Group = require('../models/Group.js');
const Listing = require('../models/Listing.js');
const requireAuth = require('../middleware/requireAuth.js');
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

function normalizeId(value) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && (value._bsontype === 'ObjectId' || typeof value.toHexString === 'function')) {
    return value.toHexString ? value.toHexString() : value.toString();
  }
  if (typeof value === 'object') {
    if (value._id != null && value._id !== value) {
      return normalizeId(value._id);
    }
    if (value.id != null && value.id !== value) {
      return normalizeId(value.id);
    }
    if (typeof value.toString === 'function' && value.toString !== Object.prototype.toString) {
      const stringValue = value.toString();
      if (stringValue && stringValue !== '[object Object]') {
        return stringValue;
      }
    }
  }
  return String(value);
}

function getGroupOwnerId(group) {
  return normalizeId(group.owner);
}

function getGroupMemberIds(group) {
  return (group.members ?? [])
    .map((member) => normalizeId(member))
    .filter(Boolean);
}

function toAvatarMember(member, fallbackId = null) {
  if (!member) {
    return fallbackId ? { id: fallbackId, initials: '', color: '#3b82f6', imgUrl: null } : null;
  }

  if (typeof member === 'string' || typeof member === 'number' || member?._bsontype === 'ObjectId') {
    const id = normalizeId(member);
    return { id, initials: '', color: '#3b82f6', imgUrl: null };
  }

  const id = normalizeId(member._id ?? member.id ?? fallbackId);
  const firstInitial = member.firstName?.[0] || '';
  const lastInitial = member.lastName?.[0] || '';

  return {
    id,
    initials: `${firstInitial}${lastInitial}`.toUpperCase(),
    color: member.color || '#3b82f6',
    imgUrl: member.avatarUrl || member.imgUrl || null,
  };
}

function isGroupOwner(group, userId) {
  return getGroupOwnerId(group) === normalizeId(userId);
}

function isGroupMember(group, userId) {
  const normalizedUserId = normalizeId(userId);
  return isGroupOwner(group, normalizedUserId) || getGroupMemberIds(group).includes(normalizedUserId);
}

function getListingId(listing) {
  return normalizeId(listing);
}

async function validateGroupPayload(body, { currentGroupId = null } = {}) {
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
  } = body ?? {};

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
      } else if (
        linkedListingDoc.occupiedBy &&
        normalizeId(linkedListingDoc.occupiedBy) !== normalizeId(currentGroupId)
      ) {
        errors.listing = 'That listing is already assigned to another group.';
      }
    }
  }

  return {
    errors,
    data: {
      groupName,
      vibeDescription,
      university,
      major,
      lifestyleTags,
      budgetMin,
      budgetMax,
      moveInDate,
      spotsNum,
      genderValue,
      linkedListingDoc,
    },
  };
}

async function syncGroupListing(groupId, previousListingId, nextListingId) {
  const previousId = getListingId(previousListingId);
  const nextId = getListingId(nextListingId);

  if (previousId && previousId !== nextId) {
    await Listing.findByIdAndUpdate(previousId, { occupiedBy: null });
  }

  if (nextId && nextId !== previousId) {
    await Listing.findByIdAndUpdate(nextId, { occupiedBy: groupId });
  }
}

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
  const members = Array.isArray(group.members)
    ? group.members.map((member, index) => toAvatarMember(member, `${g.id}-${index}`)).filter(Boolean)
    : [];

  return {
    id: g.id,
    name: g.groupName,
    school: g.university,
    budget: formatBudgetRange(g.budget),
    match: 0, // TODO: no compatibility algorithm defined yet
    desc: g.vibeDescription,
    tags: g.lifestyleTags,
    members,
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
  const members = Array.isArray(group.members)
    ? group.members.map((member, index) => toAvatarMember(member, `${g.id}-${index}`)).filter(Boolean)
    : [];
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
    groupName: g.groupName,
    badge: g.badge || null,
    location: g.university || '',
    ownerId: getGroupOwnerId(g),
    memberIds: getGroupMemberIds(g),
    heroImg: g.heroImgUrl || listingImage || null,
    members,
    vibe: g.vibeDescription,
    vibeDescription: g.vibeDescription,
    tags: g.lifestyleTags,
    lifestyleTagIds: g.lifestyleTags,
    listing,
    preferences: g.preferences ?? [],
    budget: formatBudgetRange(g.budget),
    budgetRange: g.budget ? { min: g.budget.min, max: g.budget.max } : null,
    moveIn: g.moveInDate,
    moveInDate: g.moveInDate,
    spots: g.spots,
    genderPreference: g.genderPreference,
    university: g.university,
    major: g.major,
    lease: g.lease || null,
    listingId: group.listing?._id ? group.listing._id.toString() : getListingId(group.listing),
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
  requireAuth,
  asyncHandler(async (req, res) => {
    const { errors, data } = await validateGroupPayload(req.body);

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        message: 'Some fields need your attention.',
        errors,
      });
    }

    const created = await Group.create({
      groupName: data.groupName.trim(),
      vibeDescription: data.vibeDescription,
      university: data.university,
      major: data.major,
      lifestyleTags: data.lifestyleTags,
      budget: { min: data.budgetMin, max: data.budgetMax },
      moveInDate: data.moveInDate,
      spots: data.spotsNum,
      genderPreference: data.genderValue,
      listing: data.linkedListingDoc ? data.linkedListingDoc._id : null,
      owner: req.user._id,
      members: [req.user._id],
    });

    if (data.linkedListingDoc) {
      await syncGroupListing(created._id.toString(), null, data.linkedListingDoc._id);
    }

    // Safety: ensure the creating user is present in `members` (in case the document
    // was created by a different code path or defaults changed). This guarantees
    // the creator is auto-assigned as a member of the new group.
    if (!created.members || created.members.length === 0) {
      created.members = [req.user._id];
      await created.save();
    }

    const populatedCreated = await Group.findById(created._id).populate('listing').populate('members', 'firstName lastName avatarUrl').populate('owner', 'firstName lastName');
    res.status(201).json(toProfileShape(populatedCreated));
  })
);

groupsRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid group id.' });
    }

    const group = await Group.findById(req.params.id).populate('listing').populate('owner', 'firstName lastName');
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    const viewerId = normalizeId(req.user?._id);
    const ownerId = getGroupOwnerId(group);
    const memberIds = getGroupMemberIds(group);
    const isLegacyOwnGroup = !ownerId && viewerId && memberIds.includes(viewerId);
    const viewerRole = viewerId && ownerId === viewerId
      ? 'owner'
      : viewerId && memberIds.includes(viewerId)
        ? (isLegacyOwnGroup ? 'owner' : 'member')
        : null;

    res.json({
      ...toProfileShape(group),
      ownerId: ownerId || (isLegacyOwnGroup ? viewerId : null),
      memberIds,
      viewerRole,
      canEdit: viewerRole === 'owner',
      canDelete: viewerRole === 'owner',
      showGroupId: viewerRole === 'owner' || viewerRole === 'member',
    });
  })
);

groupsRouter.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid group id.' });
    }

    const group = await Group.findById(req.params.id).populate('listing');
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    if (!isGroupOwner(group, req.user._id)) {
      return res.status(403).json({ message: 'Only the group owner can edit this group.' });
    }

    const { errors, data } = await validateGroupPayload(req.body, { currentGroupId: group._id });
    if (Object.keys(errors).length > 0) {
      return res.status(422).json({
        message: 'Some fields need your attention.',
        errors,
      });
    }

    const previousListingId = getListingId(group.listing);

    group.groupName = data.groupName.trim();
    group.vibeDescription = data.vibeDescription;
    group.university = data.university;
    group.major = data.major;
    group.lifestyleTags = data.lifestyleTags;
    group.budget = { min: data.budgetMin, max: data.budgetMax };
    group.moveInDate = data.moveInDate;
    group.spots = data.spotsNum;
    group.genderPreference = data.genderValue;
    group.listing = data.linkedListingDoc ? data.linkedListingDoc._id : null;

    await group.save();
    await syncGroupListing(group._id.toString(), previousListingId, group.listing);

    const populated = await Group.findById(group._id).populate('listing').populate('owner', 'firstName lastName');
    res.json(toProfileShape(populated));
  })
);

groupsRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid group id.' });
    }

    const group = await Group.findById(req.params.id).populate('listing');
    if (!group) return res.status(404).json({ message: 'Group not found.' });
    if (!isGroupOwner(group, req.user._id)) {
      return res.status(403).json({ message: 'Only the group owner can delete this group.' });
    }

    const listingId = normalizeId(group.listing?._id ?? group.listing);
    if (listingId) {
      await Listing.findByIdAndUpdate(listingId, { occupiedBy: null });
    }

    await Group.deleteOne({ _id: group._id });
    res.status(204).send();
  })
);

groupsRouter.get(
  '/me/group',
  requireAuth,
  asyncHandler(async (req, res) => {
    const ownedGroup = await Group.findOne({ owner: req.user._id }).populate('listing');
    if (ownedGroup) {
      return res.json({ id: ownedGroup._id.toString(), role: 'owner' });
    }

    const memberGroup = await Group.findOne({
      $or: [
        { members: req.user._id },
        { 'members.id': req.user._id.toString() },
      ],
    }).populate('listing');
    if (!memberGroup) return res.json(null);
    res.json({ id: memberGroup._id.toString(), role: 'member' });
  })
);

groupsRouter.post(
  '/:id/applications',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid group id.' });
    }

    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    const { name, age, gender, email, notes = '' } = req.body ?? {};
    const errors = {};

    if (!name || typeof name !== 'string' || !name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!email || typeof email !== 'string' || !email.trim()) {
      errors.email = 'Email is required.';
    }
    if (age !== undefined && age !== null && (!Number.isInteger(Number(age)) || Number(age) < 18 || Number(age) > 99)) {
      errors.age = 'Please provide a valid age.';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ message: 'Invalid application details.', errors });
    }

    group.applications.push({
      name: name.trim(),
      age: age ? Number(age) : undefined,
      gender: gender || '',
      email: email.trim(),
      notes: typeof notes === 'string' ? notes.trim() : '',
    });

    await group.save();
    res.status(201).json({ message: 'Application submitted.' });
  })
);

module.exports = groupsRouter;
