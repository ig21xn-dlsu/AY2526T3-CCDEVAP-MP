const User = require('../models/User');

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