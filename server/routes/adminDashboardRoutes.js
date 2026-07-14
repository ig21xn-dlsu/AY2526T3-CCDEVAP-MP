const express = require('express');
const router = express.Router();
const { getTotalUsers, getTotalListings, getTotalGroups, getTotalReports, getRecentActivity } = require('../controllers/adminDashboardController');

router.get('/total-users', getTotalUsers);
router.get('/total-listings', getTotalListings);
router.get('/total-groups', getTotalGroups);
router.get('/total-reports', getTotalReports);
router.get('/recent-activity', getRecentActivity);

module.exports = router;