require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const authRoutes = require("./routes/auth");
const packageRoutes = require("./routes/package");
const paymentRoutes = require("./routes/payment");
const clientRoutes = require("./routes/client");
const userRoutes = require("./routes/user");
const gymRoutes = require("./routes/gym");
const trainerRoutes = require("./routes/trainer");

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/gym", gymRoutes);
app.use("/api/trainer", trainerRoutes);

// Start server with WebSocket support
server.listen(5000, () => console.log("Server running on port 5000"));
