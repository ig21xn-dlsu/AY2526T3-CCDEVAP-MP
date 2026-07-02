const bcrypt = require('bcryptjs');
const User = require('../models/User');
const validator = require('validator');

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
      return res.status(400).json({ message: 'Password not strong enough' }); 
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
    const { email, password} = req.body; 
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exists' });
    } else {
      const match = await bcrypt.compare(password, existingUser.password);
      if (!match) {
        return res.status(400).json({ message: 'Incorrect Password' });
      } else {
        return res.status(201).json({ message: 'Logged In!' });
      }
    }


  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
}


module.exports = { loginUser, registerUser };