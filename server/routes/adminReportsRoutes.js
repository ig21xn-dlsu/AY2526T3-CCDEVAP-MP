const express = require('express');
const router = express.Router();
const { getReports, getPendingCount, updateReportStatus } = require('../controllers/adminReportsController');

router.get('/', getReports);
router.get('/pending-count', getPendingCount);
router.patch('/:id', updateReportStatus);

module.exports = router;