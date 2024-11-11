// userRoutes.js

const express = require('express');
const router = express.Router();
const { getUsers, updateUserRole, deleteUser , getUserById, updateUserSettings, getMe, changePassword, deleteUserAccount} = require('../controllers/userController');
const { protect, authorize, managerCanUpdateUser } = require('../middleware/authMiddleware');

// Define routes
router.put('/settings', protect, updateUserSettings);
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteUserAccount);
router.get('/', protect,authorize('ac','mc','manager'), getUsers);     // Get all users
router.put('/change-password', protect, changePassword);
router.get('/:id', protect, authorize('manager'), getUserById);  // Allow only managers to get user details
router.put('/:id/role', protect, authorize('manager'),managerCanUpdateUser, updateUserRole); // Update a user by ID
router.delete('/:id', protect, authorize('manager'),managerCanUpdateUser,  deleteUser); // Delete a user by ID



module.exports = router;