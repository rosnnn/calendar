import express from "express";
import Goal from "../models/Goal.js";

const router = express.Router();

// Get all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new goal
router.post("/", async (req, res) => {
  const { name, color } = req.body;
  try {
    const newGoal = new Goal({ name, color });
    const savedGoal = await newGoal.save();
    res.status(201).json(savedGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
