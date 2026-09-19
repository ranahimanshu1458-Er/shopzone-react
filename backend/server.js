require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminStatsRoutes = require("./routes/adminStatsRoutes");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/stats", adminStatsRoutes);

app.get("/", (req, res) => {
  res.send("ShopZone Backend is Running!");
});

const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
});