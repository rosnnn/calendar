import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  title: String,
  category: String,
  start: Date,
  end: Date,
  color: String,
});

const Event = mongoose.model("Event", EventSchema);
export default Event;
