const mongoose = require('mongoose');
const Listing = require('../models/Listing.js');
const Inquiry = require('../models/InquiryMessage.js').default;

/**
 * GET /api/stats/manager
 *
 * Scoped to the currently authenticated manager (req.user, set by your auth
 * middleware from the OAuth/JWT context). Returns:
 *  - totalListings: count of the manager's non-deleted listings
 *  - occupiedListings: count of those with isOccupied: true
 *  - activeInquiries: unread inquiries addressed to this manager, created
 *    in the last 7 days (approximated via the ObjectId's embedded timestamp,
 *    since Inquiry has no createdAt/timestamps field)
 */
const getManagerStats = async (req, res) => {
  try {
    // requireAuth attaches the authenticated user doc (with just _id selected) to req.user
    const ownerId = req.user._id;

    // Build an ObjectId whose embedded timestamp is 7 days ago, so we can
    // filter "created in the last week" without a createdAt field.
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoObjectId = mongoose.Types.ObjectId.createFromTime(
      Math.floor(oneWeekAgo.getTime() / 1000)
    );

    const [totalListings, occupiedListings, activeInquiries] = await Promise.all([
      Listing.countDocuments({ owner: ownerId, isDeleted: false }),

      Listing.countDocuments({
        owner: ownerId,
        isDeleted: false,
        isOccupied: true,
      }),

      Inquiry.countDocuments({
        receiver: ownerId,
        isRead: false,
        _id: { $gte: weekAgoObjectId },
      }),
    ]);

    return res.status(200).json({
      totalListings,
      occupiedListings,
      activeInquiries,
    });
  } catch (err) {
    console.error('Error computing manager stats:', err);
    return res.status(500).json({ message: 'Failed to compute manager statistics' });
  }
};

module.exports = { getManagerStats };
