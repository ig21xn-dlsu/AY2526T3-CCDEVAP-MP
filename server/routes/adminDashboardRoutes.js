const express = require('express');
const router = express.Router();
const {
    getTotalUsers,
    getTotalListings,
    getTotalGroups,
    getTotalReports,
    getRecentActivity,
    getGrowthTrends,
    getListingsByCampus,
    getGroupsByUniversity
} = require('../controllers/adminDashboardController');

router.get('/total-users', getTotalUsers);
router.get('/total-listings', getTotalListings);
router.get('/total-groups', getTotalGroups);
router.get('/total-reports', getTotalReports);

router.get('/recent-activity', getRecentActivity);
router.get('/growth-trends', getGrowthTrends);

router.get('/listings-by-campus', getListingsByCampus);
router.get('/groups-by-university', getGroupsByUniversity);

module.exports = router;