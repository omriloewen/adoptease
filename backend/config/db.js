const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize instance to manage MySQL connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql',  // Using MySQL
  port: process.env.DB_PORT || 3306,  // MySQL default port
});

// Function to authenticate the database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };