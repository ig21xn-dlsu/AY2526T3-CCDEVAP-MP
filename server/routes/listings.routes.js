import { Router } from 'express';
import { Listing, CAMPUSES, STATUSES } from '../models/Listing.js';
import { generateListingId } from '../utils/helpers.js';
import { upload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listingsRouter = Router();

const VALID_STATUS = new Set(STATUSES);
const VALID_CAMPUS = new Set(CAMPUSES);

/**
 * GET /listings
 * Optional filters: ?status=available&campus=UST&search=malate
 */
listingsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const { status, campus, search } = req.query;
    const filter = {};

    if (status) {
      if (!VALID_STATUS.has(status)) {
        return res.status(400).json({ message: 'Invalid status filter.' });
      }
      filter.status = status;
    }

    if (campus) {
      if (!VALID_CAMPUS.has(campus)) {
        return res.status(400).json({ message: 'Invalid campus filter.' });
      }
      filter.nearbyCampus = campus;
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings.map((l) => l.toJSON()));
  })
);

listingsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid listing id.' });

    const listing = await Listing.findById(id);
    if (!listing) return res.status(404).json({ message: 'Listing not found.' });

    res.json(listing.toJSON());
  })
);

/**
 * POST /listings
 * multipart/form-data with fields: title, description, price, status,
 * nearbyCampus, and an "image" file part.
 */
listingsRouter.post(
  '/',
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { title, description = '', price, status = 'available', nearbyCampus } = req.body ?? {};

    const errors = {};

    if (!title || !title.trim()) {
      errors.title = 'Title is required (building name recommended for searchability).';
    }

    if (description.length > 3000) {
      errors.description = 'Description must be 3000 characters or fewer.';
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) {
      errors.price = 'Price must be a non-negative number.';
    }

    if (!VALID_STATUS.has(status)) {
      errors.status = `Status must be one of: ${[...VALID_STATUS].join(', ')}.`;
    }

    if (!VALID_CAMPUS.has(nearbyCampus)) {
      errors.nearbyCampus = `Nearby campus must be one of: ${[...VALID_CAMPUS].join(', ')}.`;
    }

    if (Object.keys(errors).length > 0) {
      return res.status(422).json({ message: 'Some fields need your attention.', errors });
    }

    const id = await generateListingId();
    const img = req.file ? `/uploads/${req.file.filename}` : null;

    const created = await Listing.create({
      _id: id,
      title: title.trim(),
      description,
      price: priceNum,
      status,
      nearbyCampus,
      img,
    });

    res.status(201).json(created.toJSON());
  })
);

/**
 * PATCH /listings/:id/status
 * Body: { status: "occupied" | "available" }
 */
listingsRouter.patch(
  '/:id/status',
  asyncHandler(async (req, res) => {
    const { status } = req.body ?? {};
    if (!VALID_STATUS.has(status)) {
      return res.status(422).json({ message: `Status must be one of: ${[...VALID_STATUS].join(', ')}.` });
    }

    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid listing id.' });

    const updated = await Listing.findByIdAndUpdate(id, { status }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Listing not found.' });

    res.json(updated.toJSON());
  })
);

listingsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'Invalid listing id.' });

    const deleted = await Listing.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Listing not found.' });

    res.status(204).send();
  })
);
