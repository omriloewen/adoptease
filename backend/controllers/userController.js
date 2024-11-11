const User = require('../models/userModel');

// Add a candidate
const addUser = async (req, res) => {
  const { firstName, lastName, email, password, roles } = req.body;

  try {
    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        roles
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// View all candidates
const getUsers = async (req, res) => {
  try {
    const user = await User.findAll();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update candidate
const updateUserRole = async (req, res) => {
  const { id } = req.params;
  const { roles } = req.body;  // Only accept the role field from the request body

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Ensure that only the role field is updated
    await user.update({ roles });

    res.status(200).json({ message: 'User roles updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error.message);  // Log the specific error
    res.status(500).json({ message: 'Error updating user role', error: error.message });
  }
};


  
  // Delete candidate
  const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.destroy();
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error });
    }
  };

  const getUserById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByPk(id);  // Find the user by primary key (ID)
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);  // Send back the user data
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ message: 'Error fetching user by ID' });
    }
  };

  const updateUserSettings = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
  
    try {
      const user = await User.findByPk(req.user.id);  // Use the logged-in user's ID
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user details (except the role)
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.email = email || user.email;
      if (password) {
        user.password = password;  // Allow updating the password if provided
      }
  
      await user.save();
      res.status(200).json({ message: 'User settings updated successfully' });
    } catch (error) {
      console.error('Error updating user settings:', error);
      res.status(500).json({ message: 'Failed to update user settings' });
    }
  };
  const getMe = async (req, res) => {
    try {
      console.log('Fetching data for user:', req.user.id);  // Log the user ID
  
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },  // Exclude the password field
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Failed to fetch user data' });
    }
  };

  const changePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;
  
    // Check if new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: 'New passwords do not match' });
    }
  
    try {
      const user = await User.findByPk(req.user.id);  // Get the logged-in user
  
      // Check if the old password is correct
      if (!user || !(await user.matchPassword(oldPassword))) {
        return res.status(400).json({ message: 'Old password is incorrect' });
      }
  
      // Update the user's password
      user.password = newPassword;
      await user.save();
  
      res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
      console.error('Error changing password:', error);
      res.status(500).json({ message: 'Failed to change password' });
    }
  };

  const deleteUserAccount = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      await user.destroy();  // Delete the user's account from the database
  
      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error('Error deleting user account:', error);
      res.status(500).json({ message: 'Failed to delete user account' });
    }
  };

module.exports = { addUser, getUsers, updateUserRole, deleteUser, getUserById, updateUserSettings, getMe, changePassword, deleteUserAccount};