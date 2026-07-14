const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['user_created', 'listing_created', 'report_created'],
        required: true,
    },
    message: { type: String, required: true },
    relatedId: { type: mongoose.Schema.Types.ObjectId }, // optional link back to the User/Listing/Report doc
}, { timestamps: true }); 

module.exports = mongoose.model('ActivityLog', activityLogSchema);