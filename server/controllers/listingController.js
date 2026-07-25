const mongoose = require('mongoose');
const Listing = require('../models/Listing');




/* 
 * GET /api/listing/manager 
 * 
 * Queries the for all the listings created by the currently logged in manager 
 * and responds a json format of all of them 
 *
 * 
*/
exports.getListingOwner = async (req, res) => {
  try {
    const listings = await Listing.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(listings);
  }
  catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/*
  * POST /api/listing/ 
  *
  * Accepts form data from create listing page, 
  * and checks their content for errors. 
  *
  * @res = contains errors messsages, will integrate with frontend soon
  *
*/



exports.createListing = async (req, res) => {
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

  const parsedCapacity =
    Number(maximumCapacity);

  if (
    !Number.isFinite(parsedCapacity)
  ) {
    errors.maximumCapacity =
      "Maximum capacity must be a valid number.";
  }

  else if (
    parsedCapacity < 1
  ) {
    errors.maximumCapacity =
      "Maximum capacity must be at least 1.";
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
  console.log("PAYLOAD TO CREATE:", { maximumCapacity: parsedCapacity });
  const created =
    await Listing.create({
      roomTitle:
        roomTitle.trim(),

      price:
        parsedPrice,

      maximumCapacity:
        parsedCapacity,

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

      imageUrl: imageUrl || [],
      owner: req.user._id,
    });
  res.status(201).json(created);
}


/*
  * GET /api/listing/:id
  *
  * This function queries to find a specific listing by its ID
  *
  * @param id the value assigned id upon a specific listing is created 
  * 
*/
exports.getListingById(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      message: "Invalid Listing id"
    });
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(404).json({
      message: "Listing not found."
    });
  }
  res.json(listing);
}
);
