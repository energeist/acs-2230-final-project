require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Sign Up
router.get('/', async (req, res) => {
  try {
    const cats = await Cat.find();
    res.status(418).json(cats);
  } catch (err) {
    res.status(500).json({ message: err.message }); // returns 500 which means there was a server error
  };
});

// Login

// Log out

module.exports = router;

