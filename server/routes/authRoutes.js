const express = require('express');
const router = express.Router();
const { registerUser, loginUser, loginAdmin, getUserById } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/adminlogin', loginAdmin);
router.get('/:id', getUserById);

module.exports = router;
