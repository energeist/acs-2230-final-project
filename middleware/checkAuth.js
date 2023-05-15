const jwt = require('jsonwebtoken');
const User = require('../models/user');

const checkAuth = async (req, res, next) => {
  console.log('Checking authentication');
  try {
    if (req.url === '/users/signup' || req.url === '/users/login') {
      console.log("signup/login does not require JWT");
      next();
    } else {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.SECRET);
      const user = await User.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        return res.status(400).json({ message: "Invalid JWT, try logging in again." });
      };
    };
  } catch(err) {
    return res.status(401).json({ message: "Not Authorized. Please login to continue, or include JWT with your requests." })
  };
};

module.exports = checkAuth;