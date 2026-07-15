const express = require('express');
const router = express.Router();
const { getManagerStats } = require('../controllers/personalStatController.js');
const requireAuth = require('../middleware/requireAuth');

router.get('/manager', requireAuth, getManagerStats);

module.exports = router;
