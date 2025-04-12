import mongoose from "mongoose";

const GoalSchema = new mongoose.Schema({
  name: String,
  color: String,
});

const Goal = mongoose.model("Goal", GoalSchema);
export default Goal;
