import { configureStore } from "@reduxjs/toolkit";
import eventReducer from "./slices/eventSlice";
import goalReducer from "./slices/goalSlice";
import taskReducer from "./slices/taskSlice";

export const store = configureStore({
  reducer: {
    events: eventReducer,
    goals: goalReducer,
    tasks: taskReducer,
  },
});
