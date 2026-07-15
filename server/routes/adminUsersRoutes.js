const express = require('express');
const router = express.Router();
const { getUsers, updateUserStatus, exportUsersCSV } = require('../controllers/adminUsersController');

router.get('/', getUsers);
router.patch('/:id/status', updateUserStatus);
router.get('/export/csv', exportUsersCSV);

module.exports = router;