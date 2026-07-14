const express = require('express');
const router = express.Router();
const { getTotalUsers, getTotalListings } = require('../controllers/adminDashboardController');

router.get('/total-users', getTotalUsers);
router.get('/total-listings', getTotalListings);

module.exports = router;