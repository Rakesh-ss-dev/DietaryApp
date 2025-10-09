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
const clientRoutes = require('./routes/client'); 

app.use("/api/auth", authRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/client",clientRoutes);

require("./cronJobs"); // Make sure filename is exactly cronJob.js

// Start server with WebSocket support
server.listen(5000, () => console.log("Server running on port 5000"));
