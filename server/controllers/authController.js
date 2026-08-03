const bcrypt = require('bcryptjs');
const User = require('../models/User');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const ActivityLog = require('../models/ActivityLog');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' }); // expires in three days
}

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Not a valid email' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password should start hitting the gym, eh?' });
    }

    if (!(password === confirmPassword)) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const allowedPublicRoles = ['student', 'manager'];
    const safeRole = allowedPublicRoles.includes(role) ? role : 'student';

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: safeRole,
    });

    try {
      await ActivityLog.create({
        type: 'user_created',
        message: `${user.firstName} ${user.lastName} created a new account.`,
        relatedId: user._id,
      });
    } catch (logErr) {
      console.error('Failed to log activity:', logErr.message);
    }

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const adminCreateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Not a valid email' });
    }

    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password should start hitting the gym, eh?' });
    }

    if (!(password === confirmPassword)) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const allowedRoles = ['student', 'manager', 'admin'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    try {
      await ActivityLog.create({
        type: 'user_created',
        message: `${req.user._id} created a new ${role} account for ${user.firstName} ${user.lastName}.`,
        relatedId: user._id,
      });
    } catch (logErr) {
      console.error('Failed to log activity:', logErr.message);
    }

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exists' });
    }

    if (existingUser.role === 'admin') {
      return res.status(400).json({ message: 'The admin button is literally down here bro -_-' });
    }

    if (existingUser.status === 'suspended') {
      return res.status(403).json({ message: 'This account has been suspended. Please contact support.' });
    }

    const token = await checkCredentials(existingUser, password);
    return res.status(200).json({
       message: 'Logged In!',
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        role: existingUser.role,
        _id: existingUser._id, 
        token
    });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingAdmin = await User.findOne({ email });
    if (!existingAdmin) {
      return res.status(400).json({ message: 'Admin account not found' });
    }

    if (!(existingAdmin.role === 'admin')) {
      return res.status(400).json({ message: 'Admin account not found' });
    }

    if (existingAdmin.status === 'suspended') {
      return res.status(403).json({ message: 'This account has been suspended. Please contact support.' });
    }

    const token = await checkCredentials(existingAdmin, password);
    return res.status(200).json({
      message: 'Logged In!',
      email: existingAdmin.email,
      firstName: existingAdmin.firstName,
      lastName: existingAdmin.lastName,
      role: existingAdmin.role,
      _id: existingAdmin._id, 
      token
    });

  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

const checkCredentials = async (user, password) => {

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error('Invalid credentials.')
  }

  return createToken(user._id);
}

// This function handles "get public user info by id"
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('firstName lastName');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getUserById, loginUser, registerUser, loginAdmin, adminCreateUser };