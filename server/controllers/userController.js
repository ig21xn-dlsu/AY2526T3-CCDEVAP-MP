const bcrypt = require('bcryptjs');
const User = require('../models/User');
const validator = require('validator');

const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email } = req.body;

    // Only the account owner or an admin can edit this profile.
    if (req.user._id.toString() !== id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only edit your own profile.' });
    }

    if (email && !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Not a valid email' });
    }

    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (email) updates.email = email;

    const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true })
      .select('firstName lastName email role');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (req.user._id.toString() !== id) {
      return res.status(403).json({ message: 'You can only change your own password.' });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: 'Password should start hitting the gym, eh?' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Current password is incorrect.' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['active', 'suspended'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status.' });
    }

    if (req.user._id.toString() === id) {
      return res.status(400).json({ message: 'You cannot change your own account status.' });
    }

    const updatedUser = await User.findByIdAndUpdate(id, { status }, { new: true })
      .select('firstName lastName email role status');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { updateUserProfile, updateUserPassword, updateUserStatus };