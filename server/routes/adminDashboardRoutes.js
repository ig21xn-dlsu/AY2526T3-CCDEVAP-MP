const express = require('express');
const router = express.Router();
const { getTotalUsers, getTotalListings, getTotalGroups, getTotalReports, getRecentActivity, getGrowthTrends } = require('../controllers/adminDashboardController');
router.get('/total-users', getTotalUsers);
router.get('/total-listings', getTotalListings);
router.get('/total-groups', getTotalGroups);
router.get('/total-reports', getTotalReports);

router.get('/recent-activity', getRecentActivity);
router.get('/growth-trends', getGrowthTrends);

module.exports = router;