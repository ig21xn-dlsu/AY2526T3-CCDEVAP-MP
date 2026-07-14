const User = require('../models/User');
const Listing = require('../models/Listing');
const Group = require('../models/Group');
const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');

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

exports.getRecentActivity = async (req, res) => {
    try {
        const activity = await ActivityLog.find()
            .sort({ createdAt: -1 })
            .limit(5);
        res.status(200).json(activity);
    } catch (err) {
        console.error('Error fetching recent activity:', err);
        res.status(500).json({ message: 'Failed to fetch recent activity' });
    }
};

// STUFF FOR THE GRAPH
// Builds the last `count` months as { year, month, label }, oldest first
const getLastNMonths = (count) => {
    const months = [];
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push({
            year: d.getFullYear(),
            month: d.getMonth() + 1, 
            label: d.toLocaleString('default', { month: 'short' }), 
        });
    }

    return months;
};

// Groups a model's documents by year+month, returns a lookup map like { "2026-7": 12 }
const getMonthlyCounts = async (Model) => {
    const results = await Model.aggregate([
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                },
                count: { $sum: 1 },
            },
        },
    ]);

    const map = {};
    results.forEach((r) => {
        const key = `${r._id.year}-${r._id.month}`;
        map[key] = r.count;
    });

    return map;
};

exports.getGrowthTrends = async (req, res) => {
    try {
        const months = getLastNMonths(6);

        const [userCounts, listingCounts, groupCounts, reportCounts] = await Promise.all([
            getMonthlyCounts(User),
            getMonthlyCounts(Listing),
            getMonthlyCounts(Group),
            getMonthlyCounts(Report),
        ]);

        const chartData = months.map(({ year, month, label }) => {
            const key = `${year}-${month}`;
            return {
                month: label,
                users: userCounts[key] || 0,
                listings: listingCounts[key] || 0,
                groups: groupCounts[key] || 0,
                reports: reportCounts[key] || 0,
            };
        });

        res.status(200).json(chartData);
    } catch (err) {
        console.error('Error fetching growth trends:', err);
        res.status(500).json({ message: 'Failed to fetch growth trends' });
    }
};

// Yes
exports.getListingsByCampus = async (req, res) => {
    try {
        const results = await Listing.aggregate([
            {
                $group: {
                    _id: '$nearestCampus',
                    count: { $sum: 1 },
                },
            },
        ]);

        const data = results.map((r) => ({
            campus: r._id || 'Unspecified',
            count: r.count,
        }));

        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching listings by campus:', err);
        res.status(500).json({ message: 'Failed to fetch listings by campus' });
    }
};

exports.getGroupsByUniversity = async (req, res) => {
    try {
        const results = await Group.aggregate([
            {
                $group: {
                    _id: '$university',
                    count: { $sum: 1 },
                },
            },
        ]);

        const data = results.map((r) => ({
            university: r._id?.trim() ? r._id : 'Unspecified',
            count: r.count,
        }));

        res.status(200).json(data);
    } catch (err) {
        console.error('Error fetching groups by university:', err);
        res.status(500).json({ message: 'Failed to fetch groups by university' });
    }
};