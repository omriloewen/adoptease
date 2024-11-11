const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');  // Import the sequelize instance

const Candidate = sequelize.define('Candidate', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wantedDog: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  interviewer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  colorMark: {
    type: DataTypes.STRING,  // Or DataTypes.VARCHAR
    allowNull: true,         // Allow null if not every user will have a color mark
    defaultValue: null       // Default to null if no color is set
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  
});

module.exports = Candidate;