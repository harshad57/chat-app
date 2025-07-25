const asynchandler = require('express-async-handler');
const User = require('../model/usermodel.js');
const generateToken = require('../config/generateToken.js');
const bcrypt = require('bcryptjs');

// -----------------------------
// REGISTER USER
// -----------------------------
const registeruser = asynchandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name.trim() || !email.trim() || !password.trim()) {
    res.status(400);
    throw new Error('Please fill all the fields');
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400).json({
      success: false,
      msg: 'User already exist !',
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    name,
    email,
    password: hashPassword,
  });

  if (newUser) {
    const token = generateToken(newUser._id);
    res.json({
      success: true,
      userData: newUser,
      token,
      msg: 'Account created successfully !',
    });
  } else {
    res.status(400).json({
      success: false,
      msg: 'Failed to create User !',
    });
  }
});

// -----------------------------
// LOGIN USER
// -----------------------------
const authuser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400).json({
      success: false,
      msg: 'User not Found !',
    });
  }

  const passwordmatch = await bcrypt.compare(password, user.password);

  if (!passwordmatch) {
    res.status(400).json({
      success: false,
      msg: 'Invalid Email or Password !',
    });
  }

  const token = generateToken(user._id);
  res.json({
    success: true,
    userData: user,
    token,
    msg: 'Login successful !',
  });
});

// -----------------------------
// CHECK AUTH
// -----------------------------
const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { registeruser, authuser, checkAuth };