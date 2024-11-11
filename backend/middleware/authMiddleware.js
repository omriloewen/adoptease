const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Protect middleware to verify the user is logged in
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findByPk(decoded.id);
      if (!req.user) {
        return res.status(404).json({ message: 'User not found' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

// Custom authorize middleware
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    const userRoles = req.user.roles;  // User roles are now an array
    const hasRole = userRoles.some(role => allowedRoles.includes(role));  // Check if the user has any of the allowed roles
    if (!hasRole) {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }
    next();
  };
};

// Special manager-only check for user role updates (managers cannot change other managers)
const managerCanUpdateUser = (req, res, next) => {
  const { id } = req.params;

    User.findByPk(id).then((user) => {
      if (user && user.roles.includes('manager')) {
        console.log("trying to mdify manager")
        return res.status(403).json({ message: 'Managers cannot modify other managers' });
      }else{ 
        next();
      }
    });
  };

module.exports = { protect, authorize, managerCanUpdateUser };