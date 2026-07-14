const express = require('express');
const router = express.Router();
const { getTotalUsers, getTotalListings, getTotalGroups } = require('../controllers/adminDashboardController');

router.get('/total-users', getTotalUsers);
router.get('/total-listings', getTotalListings);
router.get('/total-groups', getTotalGroups);

module.exports = router;