const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Get the token from the Authorization header (typically "Bearer <token>")
    const token = req.header('Authorization').replace('Bearer ', '');

    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Attach the user to the request object for further use in other routes
    req.user = user;

    // Move to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

module.exports = authenticate;
