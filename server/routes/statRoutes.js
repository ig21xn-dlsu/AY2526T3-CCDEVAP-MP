const express = require('express');
const router = express.Router();
const { getGroupStats } = require('../controllers/statController'); // adjust path

// GET /api/stats/groups
router.get('/groups', getGroupStats);

module.exports = router;
