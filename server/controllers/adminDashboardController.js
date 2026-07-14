const User = require('../models/User');
const Listing = require('../models/Listing');
const Group = require('../models/Group');
const Report = require('../models/Group');

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

exports.getTotalGroups = async (req, res) => {
    try {
        const totalGroups = await Group.countDocuments();
        res.status(200).json({ totalGroups });
    } catch (err) {
        console.error('Error fetching total groups: ', err);
        res.status(500).json({ message: 'Failed to fetch total listings ' });
    }
}

exports.getTotalReports = async (req, res) => {
    try {
        const totalReports = await Report.countDocuments();
        res.status(200).json({ totalReports });
    } catch (err) {
        console.error('Error fetching total groups: ', err);
        res.status(500).json({ message: 'Failed to fetch total groups ' });
    }
}