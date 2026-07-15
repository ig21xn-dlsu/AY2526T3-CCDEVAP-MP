const mongoose = require('mongoose');
const Report = require('../models/Report');
const Listing = require('../models/Listing');

async function createReport(req, res) {
  try {
    const reportedBy = req.user._id;
    const { listingId, reason } = req.body;

    if (!listingId || !reason) {
      return res.status(400).json({ message: 'Listing and reason are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ message: 'Invalid listing id.' });
    }

    const trimmedReason = String(reason).trim();
    if (!trimmedReason) {
      return res.status(400).json({ message: 'Reason is required.' });
    }

    if (trimmedReason.length > 300) {
      return res.status(400).json({ message: 'Reason must be 300 characters or less.' });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found.' });
    }

    const report = await Report.create({
      listingId: listing._id,
      reportedBy,
      reason: trimmedReason,
    });

    return res.status(201).json({
      message: 'Report submitted.',
      report,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = { createReport };