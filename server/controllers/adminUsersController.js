const User = require('../models/User');
const { Parser } = require('json2csv');

exports.getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const search = req.query.search || '';

        const filter = {
            role: { $in: ['student', 'manager'] }, 
        };

        if (search) {
            filter.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        const totalUsers = await User.countDocuments(filter);

        const users = await User.find(filter)
            .select('firstName lastName email role status createdAt')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            users,
            totalUsers,
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['active', 'suspended'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(403).json({ message: 'Cannot modify admin accounts' });
        }

        user.status = status;
        await user.save();

        res.status(200).json({
            message: `User ${status === 'suspended' ? 'suspended' : 'reactivated'} successfully`,
            user: { id: user._id, status: user.status },
        });
    } catch (err) {
        console.error('Error updating user status:', err);
        res.status(500).json({ message: 'Failed to update user status' });
    }
};

exports.exportUsersCSV = async (req, res) => {
    try {
        const users = await User.find({ role: { $in: ['student', 'manager'] } })
            .select('firstName lastName email role status createdAt')
            .sort({ createdAt: -1 })
            .lean(); 

        const fields = [
            { label: 'First Name', value: 'firstName' },
            { label: 'Last Name', value: 'lastName' },
            { label: 'Email', value: 'email' },
            { label: 'Role', value: 'role' },
            { label: 'Status', value: 'status' },
            { label: 'Joined', value: 'createdAt' },
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(users);

        res.header('Content-Type', 'text/csv');
        res.attachment('users-export.csv');
        res.send(csv);
    } catch (err) {
        console.error('Error exporting users:', err);
        res.status(500).json({ message: 'Failed to export users' });
    }
};