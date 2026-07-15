const express = require('express');
const requireAuth = require('../middleware/requireAuth');
const { createReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/', requireAuth, createReport);

module.exports = router;