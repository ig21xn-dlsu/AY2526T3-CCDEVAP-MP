const mongoose = require('mongoose');
const Listing = require('../models/Listing');




/*
  * @desc fetch listings  
  * @route GET /api/listing/manager
  * @access PRIVATE
  *
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
