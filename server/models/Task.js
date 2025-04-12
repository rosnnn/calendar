import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  name: String,
  goalId: mongoose.Schema.Types.ObjectId,
});

const Task = mongoose.model("Task", TaskSchema);
export default Task;
