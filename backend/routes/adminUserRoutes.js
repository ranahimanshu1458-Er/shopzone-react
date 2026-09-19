const express = require("express");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Get all users - Admin only
router.get(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ createdAt: -1 });

      res.json(users);
    } catch (error) {
      console.error("LOAD USERS ERROR:", error);

      res.status(500).json({
        message: "Failed to load users.",
        error: error.message,
      });
    }
  }
);

// Update user role - Admin only
router.put(
  "/:id/role",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { role } = req.body;

      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          message: "Invalid role.",
        });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "User not found.",
        });
      }

      user.role = role;

      await user.save();

      res.json({
        message: "User role updated successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      console.error("UPDATE USER ROLE ERROR:", error);

      res.status(500).json({
        message: "Failed to update user role.",
        error: error.message,
      });
    }
  }
);

module.exports = router;