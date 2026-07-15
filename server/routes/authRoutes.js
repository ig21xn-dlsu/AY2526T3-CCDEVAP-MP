const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, getUserById } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const { updateUserProfile, updateUserPassword } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/adminlogin', loginAdmin);
router.get('/:id', getUserById);

router.patch('/:id', requireAuth, updateUserProfile);
router.patch('/:id/password', requireAuth, updateUserPassword);

module.exports = router;
