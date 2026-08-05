const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, getUserById, adminCreateUser, getMe } = require('../controllers/authController');
const requireAuth = require('../middleware/requireAuth');
const requireAdmin = require('../middleware/requireAdmin');
const { updateUserProfile, updateUserPassword, updateUserStatus } = require('../controllers/userController');
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { message: 'Too many attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/adminlogin', authLimiter, loginAdmin);
router.get('/me', requireAuth, getMe);
router.get('/:id', requireAuth, getUserById);

router.get('/me', requireAuth, getMe);
router.get('/:id', requireAuth, getUserById);


router.post('/admin/create-user', requireAuth, requireAdmin, adminCreateUser);

router.patch('/:id', requireAuth, updateUserProfile);
router.patch('/:id/status', requireAuth, requireAdmin, updateUserStatus);
router.patch('/:id/password', requireAuth, updateUserPassword);

module.exports = router;