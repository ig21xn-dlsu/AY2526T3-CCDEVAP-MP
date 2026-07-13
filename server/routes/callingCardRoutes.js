const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const CallingCard = require("../models/CallingCard").default;

const router = express.Router();

/**
 * GET /api/calling-card/:userId
 * Public — anyone viewing a listing needs to be able to fetch the owner's card
 */
router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user id." });
    }

    const card = await CallingCard.findById(userId);

    if (!card) {
      return res.status(404).json({ message: "Calling card not found." });
    }

    res.status(200).json(card);
  })
);

/**
 * POST /api/calling-card
 * Creates a calling card for the logged-in user (one per user)
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const existing = await CallingCard.findById(req.user._id);

    if (existing) {
      return res.status(409).json({ message: "Calling card already exists. Use PUT to update it." });
    }

    const { phone, email, links } = req.body;

    const card = await CallingCard.create({
      _id: req.user._id,
      phone,
      email,
      links,
    });

    res.status(201).json(card);
  })
);

/**
 * PUT /api/calling-card
 * Updates the logged-in user's existing calling card
 */
router.put(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { phone, email, links } = req.body;

    const card = await CallingCard.findByIdAndUpdate(
      req.user._id,
      { phone, email, links },
      { new: true, runValidators: true, upsert: true } // upsert: create it if it somehow doesn't exist yet
    );

    res.status(200).json(card);
  })
);

/**
 * DELETE /api/calling-card
 * Deletes the logged-in user's calling card
 */
router.delete(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const deleted = await CallingCard.findByIdAndDelete(req.user._id);

    if (!deleted) {
      return res.status(404).json({ message: "Calling card not found." });
    }

    res.status(200).json({ message: "Calling card deleted." });
  })
);

module.exports = router;
