const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkAuth = async (req, res, next) => {
  console.log('Checking authentication');
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decodedToken._id)
    if (user) {
      req.user = user;
      next();
    } else {
      return res.status(400).json({ message: "Invalid JWT, try logging in again." });
    }
  } catch(err) {
    return res.status(500).json({ message: "Server error.  Please try again later." })
  }
};

module.exports = checkAuth;