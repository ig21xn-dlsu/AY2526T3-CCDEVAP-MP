const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
    adminNotes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);