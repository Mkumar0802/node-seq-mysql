const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

require('dotenv').config(); // Ensure this is at the very top of the file






// Register user
const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  // Ensure all fields are provided
  if (!username || !email || !password) { 
    return res.status(400).json({ message: 'Please enter all fields' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Send success response
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send response with token
    res.json({ token });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login };
