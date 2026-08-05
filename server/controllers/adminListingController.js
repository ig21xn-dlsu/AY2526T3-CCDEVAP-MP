const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const Group = require('../models/Group');

const VALID_GENDERS = new Set(['male', 'female', 'co-ed']);
const VALID_CAMPUSES = new Set(['UPM', 'DLSU', 'ADMU', 'UST', 'UPD']);

exports.getListings = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { campus, status, search, minPrice, maxPrice } = req.query;

        const filter = {};

        if (campus) {
            filter.nearestCampus = campus;
        }

        // status is a derived field (isDeleted / isOccupied), not stored directly
        if (status === 'deleted') {
            filter.isDeleted = true;
        } else if (status === 'active') {
            filter.isDeleted = { $ne: true };
            filter.isOccupied = { $ne: true };
        } else if (status === 'inactive') {
            filter.isDeleted = { $ne: true };
            filter.isOccupied = true;
        }
        // no status filter -> admin sees everything, including deleted, by default

        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        if (search) {
            filter.$or = [
                { roomTitle: { $regex: search, $options: 'i' } },
                { buildingName: { $regex: search, $options: 'i' } },
            ];
        }
        

        const total = await Listing.countDocuments(filter);

        const listings = await Listing.find(filter)
            .populate('owner', 'firstName lastName email')
            .populate('occupiedBy', 'groupName')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            data: listings,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (err) {
        console.error('Error fetching admin listings:', err);
        res.status(500).json({ message: 'Failed to fetch listings' });
    }
};

exports.createListing = async (req, res) => {
    try {
        const {
            roomTitle,
            price,
            maximumCapacity,
            gender,
            isOccupied,
            description,
            tags,
            amenities,
            buildingName,
            latitude,
            longitude,
            nearestCampus,
            contacts,
            imageUrl,
            owner,
        } = req.body;

        const errors = {};

        if (!roomTitle?.trim()) {
            errors.roomTitle = 'Room title is required.';
        }

        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            errors.price = 'Price must be a valid, non-negative number.';
        }

        const parsedCapacity = Number(maximumCapacity ?? 1);
        if (!Number.isFinite(parsedCapacity) || parsedCapacity < 1) {
            errors.maximumCapacity = 'Maximum capacity must be at least 1.';
        }

        if (gender && !VALID_GENDERS.has(gender)) {
            errors.gender = 'Invalid gender option.';
        }

        if (!VALID_CAMPUSES.has(nearestCampus)) {
            errors.nearestCampus = 'Invalid campus option.';
        }

        if (owner && !mongoose.Types.ObjectId.isValid(owner)) {
            errors.owner = 'Invalid owner id.';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Some fields need attention.', errors });
        }

        const created = await Listing.create({
            roomTitle: roomTitle.trim(),
            price: parsedPrice,
            maximumCapacity: parsedCapacity,
            gender,
            isOccupied: !!isOccupied,
            description: description || '',
            tags: tags || [],
            amenities: amenities || [],
            buildingName,
            latitude,
            longitude,
            nearestCampus,
            contacts: contacts || [],
            imageUrl: imageUrl || [],
            owner: owner || req.user?._id,
        });

        res.status(201).json(created);
    } catch (err) {
        console.error('Error creating admin listing:', err);
        res.status(500).json({ message: 'Failed to create listing' });
    }
};

exports.setListingDeleted = async (req, res) => {
    try {
        const { id } = req.params;
        const { isDeleted, deletedAt } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid listing id.' });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found.' });
        }

        listing.isDeleted = !!isDeleted;
        listing.deletedAt = isDeleted ? (deletedAt ? new Date(deletedAt) : new Date()) : null;
        await listing.save({validateModifiedOnly: true});

        res.status(200).json(listing);
    } catch (err) {
        console.error('Error updating listing deletion status:', err);
        res.status(500).json({ message: 'Failed to update listing' });
    }
};


exports.updateListing = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid listing id.' });
        }

        const listing = await Listing.findById(id);
        if (!listing) {
            return res.status(404).json({ message: 'Listing not found.' });
        }

        const {
            roomTitle,
            price,
            maximumCapacity,
            gender,
            isOccupied,
            description,
            tags,
            amenities,
            buildingName,
            latitude,
            longitude,
            nearestCampus,
            contacts,
            imageUrl,
            owner,
            occupiedBy,
        } = req.body;

        const errors = {};

        if (!roomTitle?.trim()) {
            errors.roomTitle = 'Room title is required.';
        }

        const parsedPrice = Number(price);
        if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
            errors.price = 'Price must be a valid, non-negative number.';
        }

        const parsedCapacity = Number(maximumCapacity ?? 1);
        if (!Number.isFinite(parsedCapacity) || parsedCapacity < 1) {
            errors.maximumCapacity = 'Maximum capacity must be at least 1.';
        }

        if (gender && !VALID_GENDERS.has(gender)) {
            errors.gender = 'Invalid gender option.';
        }

        if (!VALID_CAMPUSES.has(nearestCampus)) {
            errors.nearestCampus = 'Invalid campus option.';
        }

        if (!owner || !mongoose.Types.ObjectId.isValid(owner)) {
            errors.owner = 'A valid owner is required.';
        }


        if (occupiedBy && !mongoose.Types.ObjectId.isValid(occupiedBy)) {
            errors.occupiedBy = 'Invalid group id.';
        }

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ message: 'Some fields need attention.', errors });
        }

        const previousOccupiedBy = listing.occupiedBy;
        const nextOccupiedBy = occupiedBy || null;

        listing.roomTitle = roomTitle.trim();
        listing.price = parsedPrice;
        listing.maximumCapacity = parsedCapacity;
        listing.gender = gender;
        listing.description = description || '';
        listing.tags = tags || [];
        listing.amenities = amenities || [];
        listing.buildingName = buildingName;
        listing.latitude = latitude;
        listing.longitude = longitude;
        listing.nearestCampus = nearestCampus;
        listing.contacts = contacts || [];
        listing.owner = owner;
        listing.occupiedBy = nextOccupiedBy;
        listing.isOccupied = nextOccupiedBy ? true : !!isOccupied;
        if (imageUrl) {
            listing.imageUrl = imageUrl;
        }

        const updated = await listing.save();


        if (String(previousOccupiedBy || '') !== String(nextOccupiedBy || '')) {
            if (previousOccupiedBy) {
                await Group.findByIdAndUpdate(previousOccupiedBy, { listing: null });
            }
            if (nextOccupiedBy) {
                await Group.findByIdAndUpdate(nextOccupiedBy, { listing: updated._id });
            }
        }

        const populated = await updated.populate('occupiedBy', 'groupName');

        res.status(200).json(populated);
    } catch (err) {
        console.error('Error updating listing:', err);
        res.status(500).json({ message: 'Failed to update listing' });
    }
};