const Inquiry = "../models/Inquiry.js";
const Listing = "../models/Listing.js";

const createInquiry = async (req, res) => {
  try {
    const senderId = req.user._id; // comes from verifyToken middleware
    const { listingId, messageBody } = req.body;

    if (!listingId || !messageBody) {
      return res.status(400).json({ message: "Listing and message are required." });
    }

    if (messageBody.length > 500) {
      return res.status(400).json({ message: "Message must be 500 characters or less." });
    }

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found." });
    }

    if (listing.owner.toString() === senderId.toString()) {
      return res.status(400).json({ message: "You can't inquire on your own listing." });
    }

    const inquiry = await Inquiry.create({
      sender: senderId,
      receiver: listing.owner,
      listing: listing._id,
      messageBody,
      isRead: false,
    });

    return res.status(201).json({
      message: "Inquiry sent!",
      inquiry,
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Gets all inquiries where the logged-in user (space manager) is the receiver
const getInquiries = async (req, res) => {
  try {
    const receiverId = req.user._id;

    const inquiries = await Inquiry.find({ receiver: receiverId })
      .populate("sender", "email") // pull in sender's basic info, adjust fields as needed
      .populate("listing", "roomTitle")
      .sort({ createdAt: -1 });

    return res.status(200).json({ inquiries });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

// Marks a specific inquiry as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const inquiry = await Inquiry.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found." });
    }

    return res.status(200).json({ message: "Marked as read.", inquiry });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

module.exports = { createInquiry, getInquiries, markAsRead };
