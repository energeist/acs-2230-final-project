require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.get('/', async (req, res) => {
  try {
    console.log("working")
    return res.status(200).json({message: "hello"})
  } catch(err) {
    res.status(500).json({ message: err.message })
  }
})

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const user = await new User(req.body);
    const savedUser = await user.save();
    const token = await jwt.sign(
      { _id: user._id }, 
      process.env.SECRET, 
      { expiresIn: '60 days' });
    res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
    return res.status(201).json({message: "Sign-up successful.", token });
  } catch(err) {
    console.log(err.message);
    return res.status(400).send({ err });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }, 'username password');
    if (!user) {
      return res.status(401).send({ message: 'Wrong Username or Password' });
    }
    user.comparePassword(password, (err, isMatch) => {
      if (!isMatch) {
        return res.status(401).send({ message: 'Wrong Username or password' });
      }
      const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
        expiresIn: '15 days',
      });
      res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
      return res.status(200).json({ message: "Successfully logged in.", token });
    });
  } catch (err) {
    console.log(err);
  }
});

// Log out
router.get('/logout', (req, res) => {
  res.clearCookie('nToken');
  return res.redirect('/');
});

module.exports = router;

