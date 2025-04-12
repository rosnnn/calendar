import express from "express";
import Goal from "../models/Goal.js";
import Task from "../models/Task.js";

const router = express.Router();

// GOALS
router.get("/goals", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/goals", async (req, res) => {
  try {
    const goal = await Goal.create({
      name: req.body.name,
      color: req.body.color || "#" + Math.floor(Math.random() * 16777215).toString(16),
    });
    res.json(goal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/goals/:id", async (req, res) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ goalId: req.params.id }); // clean up related tasks
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ New route: Delete ALL goals (and their tasks)
router.delete("/goals", async (req, res) => {
  try {
    await Goal.deleteMany({});
    await Task.deleteMany({});
    res.json({ success: true, message: "All goals and tasks deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// TASKS
router.get("/tasks/:goalId", async (req, res) => {
  try {
    const tasks = await Task.find({ goalId: req.params.goalId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tasks", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
