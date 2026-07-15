const express = require('express');
const requireAuth = require('../middleware/requireAuth'); 
const { updateUserProfile, updateUserPassword } = require('../controllers/userController');

const router = express.Router();

router.use(requireAuth); 

router.patch('/:id', updateUserProfile);
router.patch('/:id/password', updateUserPassword);

module.exports = router;