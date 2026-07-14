const express = require('express');
const router = express.Router();
const { getTotalUsers } = require('../controllers/adminDashboardController');

router.get('/total-users', getTotalUsers);

module.exports = router;