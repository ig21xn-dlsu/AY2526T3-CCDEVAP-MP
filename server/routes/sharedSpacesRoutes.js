const express = require('express');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Listing = require('../models/Listing');

const router = express.Router();

const VALID_CAMPUSES = new Set(['UPM', 'DLSU', 'ADMU', 'UST', 'UPD']);

function toSharedSpacePayload(listing) {
  const imageUrl = Array.isArray(listing.imageUrl) ? listing.imageUrl[0] : listing.imageUrl;

  return {
    id: listing.id,
    _id: listing.id,
    roomTitle: listing.roomTitle,
    name: listing.roomTitle,
    nearestCampus: listing.nearestCampus,
    school: listing.nearestCampus,
    price: listing.price,
    address: listing.buildingName,
    buildingName: listing.buildingName,
    desc: listing.description,
    description: listing.description,
    match: 0,
    tags: listing.tags || [],
    image: imageUrl || null,
    imageUrl: imageUrl || null,
    // derive occupancy from `occupiedBy` (Group reference). If occupiedBy is null -> vacant
    vacancy: !listing.occupiedBy,
    isOccupied: !!listing.occupiedBy,
    roommates: listing.maximumCapacity,
    maximumCapacity: listing.maximumCapacity,
    distanceKm: null,
    amenities: listing.amenities || [],
    contacts: listing.contacts || [],
    latitude: listing.latitude,
    longitude: listing.longitude,
    owner: listing.owner,
    tab: 'shared',
  };
}

function buildFilter(query) {
  const { search, campus, minPrice, maxPrice, occupancy, amenities } = query;
  // exclude listings that are deleted or already occupied (prefer `occupiedBy`)
  const filter = { isDeleted: { $ne: true }, occupiedBy: null, isOccupied: { $ne: true } };

  if (campus) {
    if (!VALID_CAMPUSES.has(campus)) {
      return { error: 'Invalid campus filter.' };
    }

    filter.nearestCampus = campus;
  }

  if (search) {
    filter.$or = [
      { roomTitle: { $regex: search, $options: 'i' } },
      { buildingName: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { nearestCampus: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { amenities: { $regex: search, $options: 'i' } },
    ];
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (occupancy) {
    const selected = Array.isArray(occupancy) ? occupancy : [occupancy];
    const occupancyFilters = selected.map((value) => {
      if (value === '1-person') return { maximumCapacity: 1 };
      if (value === '2-3-people') return { maximumCapacity: { $gte: 2, $lte: 3 } };
      if (value === '4-plus') return { maximumCapacity: { $gte: 4 } };
      return null;
    }).filter(Boolean);

    if (occupancyFilters.length > 0) {
      filter.$or = filter.$or ? [{ $and: filter.$or }, { $or: occupancyFilters }] : [{ $or: occupancyFilters }];
    }
  }

  if (amenities) {
    const selectedAmenities = Array.isArray(amenities) ? amenities : [amenities];
    const validAmenities = selectedAmenities.filter(Boolean);
    if (validAmenities.length > 0) {
      filter.amenities = { $all: validAmenities };
    }
  }

  return { filter };
}

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { filter, error } = buildFilter(req.query);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings.map(toSharedSpacePayload));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid listing id.' });
    }

    const listing = await Listing.findById(req.params.id);
    if (!listing || listing.isDeleted) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    res.json(toSharedSpacePayload(listing));
  })
);

module.exports = router;