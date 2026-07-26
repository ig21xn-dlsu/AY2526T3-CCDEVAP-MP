const mongoose = require('mongoose');
const Listing = require('../models/Listing');
const Group = require('../models/Group');



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
exports.returnListing = async (req, res) => {
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





/* PATCH /api/lisiting/:id
 * 
 * This function updates the current state of rthe listing from a form in req.body
 * 
*/
exports.updateListing = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid listingd id" });
  }

  const listing = await Listing.findById(id);

  if (!listing) {
    return res.status(403).json({ message: "Listing could not be found" });
  }
  const updated =
    await Listing.findByIdAndUpdate(
      id,
      req.body,
      {
        returnDocument: "after",
        runValidators: true
      }
    );


  if (updated) {
    return res.status(200).json({ message: "Listing updated", listing: updated });
  } else {
    return res.status(400).json({ message: "Unexpected listing update error" });
  }
}

/* DELETE /api/listing/:id
 *  
 * Delete a listing with the id with ownership verification
 *
*/
exports.deleteListing = async (req, res) => {

  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  const listing = await Listing.findById(id);

  //Listing check
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  //Ownership check 
  if (listing.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You do not own this listing" });
  }

  const deletedListing = await Listing.findByIdAndDelete(id);

  if (!deletedListing) {
    return res.status(500).json({ message: "Unexepected server error" });
  } else {
    return res.status(200).json({ message: "Listing is deleted" });
  }
}

/* PATCH /api/listing/:id/status
 * 
 * Update the occupancy status 
 *
*/
exports.updateOccupancy = async (req, res) => {

  const { id } = req.params;
  const { isOccupied } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  const listing = await Listing.findById(id);

  //Listing check
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  //Ownership check 
  if (listing.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You do not own this listing" });
  }

  const updated = await Listing.findByIdAndUpdate(
    id,
    { isOccupied },
    {
      returnDocument: "after"
    }
  );

  if (!updated) {
    return res.status(500).json({ message: "Unexpected udpate error" });
  } else {
    return res.status(200).json({ message: "Occupied status changed" });
  }
}




/* PATCH /api/listing/:id/assign-group
 * 
 * This function assigns a listing to be occupied by a group.
 *
 * @param {string} req.body.groupId = groupId of the one being assigned
 * @param {string} req.params = will only contain the listing id 
*/
exports.updateListingAssignment = async (req, res) => {

  const doClear = req.body.doClear; //if this is true this controller just sets it back to null
  const groupId = req.body.groupId; //groupId to be assigne 
  const { id } = req.params; //listing to be updated   

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid listing id" });
  }

  const listing = await Listing.findById(id);

  //Listing check
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  //Ownership check 
  if (listing.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "You do not own this listing" });
  }

  let occupancyUpdate;
  if (doClear === true) {
    occupancyUpdate = null;
  } else {
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }
    occupancyUpdate = groupId;
  }


  const updated = await Listing.findByIdAndUpdate(
    id,
    {
      occupiedBy: occupancyUpdate
    },
    {
      returnDocument: "after"
    }
  )

  if (!updated) {
    return res.status(500).json({ message: "Unexpected update error" });
  } else {
    return res.status(200).json({ message: "occupiedBy successful." });
  }
}
