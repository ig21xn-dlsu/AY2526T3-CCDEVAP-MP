const mongoose = require('mongoose');
const Report = require('../models/Report');

exports.getReports = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { status, search } = req.query;

        const filter = {};
        if (status) filter.status = status; // 'pending' | 'resolved' | 'dismissed'

        const total = await Report.countDocuments(filter);

        let query = Report.find(filter)
            .populate('listingId', 'roomTitle buildingName price')
            .populate('reportedBy', 'firstName lastName email')
            .sort({ createdAt: -1 });

        if (!search) {
            query = query.skip((page - 1) * limit).limit(limit);
        }

        let reports = await query;

        // simple in-memory search across listing title / reporter name once populated
        if (search) {
            const s = search.toLowerCase();
            reports = reports.filter((r) =>
                r.listingId?.roomTitle?.toLowerCase().includes(s) ||
                `${r.reportedBy?.firstName || ''} ${r.reportedBy?.lastName || ''}`.toLowerCase().includes(s)
            );
        }

        res.status(200).json({
            data: reports,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit) || 1,
            },
        });
    } catch (err) {
        console.error('Error fetching reports:', err);
        res.status(500).json({ message: 'Failed to fetch reports' });
    }
};

exports.getPendingCount = async (req, res) => {
    try {
        const pendingCount = await Report.countDocuments({ status: 'pending' });
        res.status(200).json({ pendingCount });
    } catch (err) {
        console.error('Error fetching pending report count:', err);
        res.status(500).json({ message: 'Failed to fetch pending count' });
    }
};

exports.updateReportStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNotes } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid report id.' });
        }

        if (!['pending', 'resolved', 'dismissed'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const report = await Report.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Report not found.' });
        }

        report.status = status;
        if (typeof adminNotes === 'string') report.adminNotes = adminNotes;
        await report.save();

        res.status(200).json(report);
    } catch (err) {
        console.error('Error updating report status:', err);
        res.status(500).json({ message: 'Failed to update report' });
    }
};