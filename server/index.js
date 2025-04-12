import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import eventRoutes from "./routes/events.js";
import dataRoutes from "./routes/data.js";
import goalRoutes from "./routes/goals.js";



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api/events", eventRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/goals", goalRoutes);


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => console.error("MongoDB connection error:", error));
