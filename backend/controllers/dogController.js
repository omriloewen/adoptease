const Dog = require("../models/dogModel");

// Controller to add a new dog
const addDog = async (req, res) => {
  const { name, breed, status, image_urls, description } = req.body;

  try {
    // Assuming you are using Sequelize like with User model
    const dog = await Dog.create({
      name,
      breed,
      status,
      image_urls: JSON.stringify(image_urls), // Store as JSON
      description, // New description field
    });

    res.status(201).json(dog);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Server error" });
  }
};

const getDogs = async (req, res) => {
  try {
    const dogs = await Dog.findAll();
    res.status(200).json(dogs);
  } catch (error) {
    console.error("Error fetching dogs:", error);
    res.status(500).json({ message: "Failed to fetch dogs" });
  }
};

// Get a dog by ID
const getDogById = async (req, res) => {
  const { id } = req.params;

  try {
    const dog = await Dog.findByPk(id);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    res.status(200).json(dog);
  } catch (error) {
    console.error("Error fetching dog by ID:", error);
    res.status(500).json({ message: "Failed to fetch dog" });
  }
};

// Update a dog
const updateDog = async (req, res) => {
  const { id } = req.params;
  const { name, breed, status, image_urls, description } = req.body;

  try {
    const dog = await Dog.findByPk(id);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    await dog.update({
      name,
      breed,
      status,
      image_urls: JSON.stringify(image_urls),
      description,
    });

    res.status(200).json({ message: "Dog updated successfully" });
  } catch (error) {
    console.error("Error updating dog:", error);
    res.status(500).json({ message: "Failed to update dog" });
  }
};

const deleteDog = async (req, res) => {
  const { id } = req.params;

  try {
    const dog = await Dog.findByPk(id);

    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    await dog.destroy();
    res.status(200).json({ message: "Dog deleted successfully" });
  } catch (error) {
    console.error("Error deleting dog:", error);
    res.status(500).json({ message: "Failed to delete dog" });
  }
};

module.exports = { addDog, getDogs, getDogById, updateDog, deleteDog };
