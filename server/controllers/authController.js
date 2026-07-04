const bcrypt = require('bcryptjs');
const User = require('../models/User');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '3d' }); // expires in three days
}

// This function handles "register a new user"
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, role } = req.body;

    // validate
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

    res.status(201).json({
      message: 'User created successfully',
      user: { id: user._id, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// This function handles "logging-in"
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
      return res.status(400).json({ message: 'You stupid ah, use the admin button down here dawg' });
    }

    const token = await checkCredentials(existingUser, password);
    return res.status(200).json({ message: 'Logged In!', token });
    
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
}

// This function first if the user is an admin that's trying to log-in
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
    } else {
      
      const token = await checkCredentials(existingAdmin, password);
      return res.status(200).json({ message: 'Logged In!', token });

    }
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

module.exports = { loginUser, registerUser, loginAdmin };