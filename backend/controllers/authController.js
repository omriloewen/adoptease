const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

// Sign-up function
const signUp = async (req, res) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, email, password, roles } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create new user with multiple roles (if provided)
    user = await User.create({
      firstName,
      lastName,
      email,
      password,
      roles: roles || ["member"], // Default to 'member' if no roles are provided
    });

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        roles: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

// Login function
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Check the password
    if (!(await user.matchPassword(password))) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // Create a JWT token
    const token = jwt.sign(
      {
        id: user.id,
        roles: user.roles,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
};

const generateResetToken = (user) => {
  const payload = { id: user.id, email: user.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1h", // Token expires in 1 hour
  });
  return token;
};

module.exports = { signUp, login, generateResetToken };
