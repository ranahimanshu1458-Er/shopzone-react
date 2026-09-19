const express = require("express");
const Order = require("../models/Order");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

// Create a new order
router.post("/", protect, async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
    } = req.body;

    if (
      !items ||
      items.length === 0 ||
      !shippingAddress ||
      !shippingAddress.name ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !totalAmount ||
      !paymentMethod ||
      !paymentStatus
    ) {
      return res.status(400).json({
        message: "Please provide all order details.",
      });
    }

    const order = new Order({
      user: req.user,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus,
    });

    const savedOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("ORDER CREATION ERROR:", error);

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
});

// Get logged-in user's orders
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user,
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("LOAD ORDERS ERROR:", error);

    res.status(500).json({
      message: "Failed to load orders",
      error: error.message,
    });
  }
});

// Get all orders - Admin only
router.get(
  "/admin/all",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .sort({ createdAt: -1 });

      res.json(orders);
    } catch (error) {
      console.error("LOAD ALL ORDERS ERROR:", error);

      res.status(500).json({
        message: "Failed to load all orders",
        error: error.message,
      });
    }
  }
);

// Update order status - Admin only
router.put(
  "/admin/:id/status",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const allowedStatuses = [
        "Pending",
        "Confirmed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];

      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          message: "Invalid order status.",
        });
      }

      const order = await Order.findById(
        req.params.id
      );

      if (!order) {
        return res.status(404).json({
          message: "Order not found.",
        });
      }

      order.status = status;

      await order.save();

      res.json({
        message: "Order status updated successfully.",
        order,
      });
    } catch (error) {
      console.error(
        "UPDATE ORDER STATUS ERROR:",
        error
      );

      res.status(500).json({
        message: "Failed to update order status.",
        error: error.message,
      });
    }
  }
);

module.exports = router;