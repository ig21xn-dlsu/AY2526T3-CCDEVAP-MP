/* This file just recently got refactored by Philip, the listing model updated to a more accurate and final version I will 
 * handle this controller from now on thank you. Just refer to the commit body on github for more information ill try to document the best I can
 *
 */

const express = require("express");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const requireAuth = require("../middleware/requireAuth");
const Listing = require("../models/Listing");
console.log("LISTING MODEL: ", Listing);

const router = express.Router();

const VALID_GENDERS = new Set([
  "male",
  "female",
  "co-ed"
]);

const VALID_CAMPUSES = new Set([
  "UPM",
  "DLSU",
  "ADMU",
  "UST",
  "UPD"
]);

router.get("/manager", requireAuth, async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      campus,
      occupied,
      search,
      minPrice,
      maxPrice
    } = req.query;

    const filter = {};

    if (campus) {
      if (!VALID_CAMPUSES.has(campus)) {
        return res.status(400).json({
          message: "Invalid campus filter."
        });
      }

      filter.nearestCampus = campus;
    }

    if (occupied !== undefined) {
      filter.isOccupied =
        occupied === "true";
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte =
          Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte =
          Number(maxPrice);
      }
    }

    if (search) {
      filter.$or = [
        {
          roomTitle: {
            $regex: search,
            $options: "i"
          }
        },
        {
          buildingName: {
            $regex: search,
            $options: "i"
          }
        }
      ];
    }

    const listings =
      await Listing.find(filter)
        .sort({ createdAt: -1 });

    res.json(listings);
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid listing id."
      });
    }

    const listing =
      await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found."
      });
    }

    res.json(listing);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const {
      roomTitle,
      price,
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
      imageUrl
    } = req.body;

    const errors = {};

    if (!roomTitle?.trim()) {
      errors.roomTitle =
        "Room title is required.";
    }

    else if (roomTitle.length > 120) {
      errors.roomTitle =
        "Room title must be under 120 characters.";
    }

    const parsedPrice =
      Number(price);

    if (
      !Number.isFinite(parsedPrice)
    ) {
      errors.price =
        "Price must be a valid number.";
    }

    else if (
      parsedPrice < 0
    ) {
      errors.price =
        "Price cannot be negative.";
    }

    if (
      description &&
      description.length > 3000
    ) {
      errors.description =
        "Description must be 3000 characters or fewer.";
    }

    if (
      !VALID_GENDERS.has(gender)
    ) {
      errors.gender =
        "Invalid gender option.";
    }

    if (
      !VALID_CAMPUSES.has(
        nearestCampus
      )
    ) {
      errors.nearestCampus =
        "Invalid campus option.";
    }

    if (
      Object.keys(errors).length > 0
    ) {
      return res.status(422).json({
        message:
          "Some fields need attention.",
        errors
      });
    }

    const created =
      await Listing.create({
        roomTitle:
          roomTitle.trim(),

        price:
          parsedPrice,

        gender,

        isOccupied,

        description:
          description || "",

        tags:
          tags || [],

        amenities:
          amenities || [],

        buildingName,

        latitude,

        longitude,

        nearestCampus,

        contacts:
          contacts || [],

        imageUrl:
          imageUrl || [],
        owner: req.user._id,
      });

    res
      .status(201)
      .json(created);
  })
);

router.patch(
  "/:id/status",
  requireAuth,
  asyncHandler(async (req, res) => {

    const { id } = req.params;
    const { isOccupied } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid listing id."
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found."
      });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't own this listing."
      });
    }

    const updated =
      await Listing.findByIdAndUpdate(
        id,
        { isOccupied },
        {
          new: true
        }
      );

    res.json(updated);
  })
);

router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid listing id."
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found."
      });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't own this listing."
      });
    }

    const updated =
      await Listing.findByIdAndUpdate(
        id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {

    const { id } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id)
    ) {
      return res.status(400).json({
        message: "Invalid listing id."
      });
    }

    const listing = await Listing.findById(id);

    if (!listing) {
      return res.status(404).json({
        message: "Listing not found."
      });
    }

    if (listing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You don't own this listing."
      });
    }

    await Listing.findByIdAndDelete(id);

    res.status(204).send();
  })
);

module.exports = router;
