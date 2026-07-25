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
const listController = require("../controllers/listingController.js");
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


/* ========== Migrated  Logic listingController.js  =================== 
  * Hi, if anyone needs to check changes, everything is moved to /controller/listingController
  * -Philip
  */

router.get("/manager", requireAuth, asyncHandler(listController.getListingOwner));



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

router.get("/:id", asyncHandler(listController.getListingById));

router.post("/", requireAuth, asyncHandler(listController.createListing));

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

router.patch("/:id", requireAuth, asyncHandler(listController.updateListing));

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
