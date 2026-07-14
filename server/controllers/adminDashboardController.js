const User = require('../models/User');
const Listing = require('../models/Listing');

exports.getTotalUsers = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({  $or: [
        { role: "student" },
        { role: "manager" }
        ]});
        res.status(200).json({ totalUsers });
    } catch (err) {
        console.error('Error fetching total users:', err);
        res.status(500).json({ message: 'Failed to fetch total users' });
    }
};

exports.getTotalListings = async (req, res) => {
    try {
        const totalListings = await Listing.countDocuments();
        res.status(200).json({ totalListings });
    } catch (err) {
        console.error('Error fetching total listings:', err);
        res.status(500).json({ message: 'Failed to fetch total listings' });
    }
}