const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db"); // Adjust this as per your setup

const Dog = sequelize.define("Dog", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("adopted", "available", "other"),
    allowNull: false,
  },
  image_urls: {
    type: DataTypes.JSON, // JSON field for additional images
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT, // New description field
    allowNull: true,
  },
});

module.exports = Dog;
