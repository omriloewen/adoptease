const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");

const {
  addDog,
  getDogs,
  getDogById,
  updateDog,
  deleteDog,
} = require("../controllers/dogController");

// Route to get all dogs
router.get(
  "/",
  protect,
  authorize("ac", "mc", "vd", "md", "vc", "manager"),
  getDogs
);

// Route to get a dog by ID
router.get("/:id", protect, authorize("md", "manager"), getDogById);

// Route to update a dog's details
router.put("/:id", protect, authorize("md", "manager"), updateDog);

// Route to add a new dog (Only manager can add)
router.post("/", protect, authorize("ad", "md", "manager"), addDog);

router.delete("/:id", protect, authorize("md", "manager"), deleteDog);

module.exports = router;
