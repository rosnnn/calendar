import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async actions
export const fetchTasks = createAsyncThunk("tasks/fetch", async (goalId) => {
  const res = await axios.get(`/api/data/tasks/${goalId}`);
  return { goalId, tasks: res.data };
});

export const addTask = createAsyncThunk("tasks/add", async ({ goalId, name }) => {
  const res = await axios.post(`/api/data/tasks`, { goalId, name });
  return res.data;
});

export const deleteTask = createAsyncThunk("tasks/delete", async (taskId) => {
  await axios.delete(`/api/data/tasks/${taskId}`);
  return taskId;
});

export const clearTasksByGoal = createAsyncThunk("tasks/clearByGoal", async (goalId) => {
  // No server-side call here unless needed — we assume goal deletion already clears tasks server-side
  return goalId;
});

// Slice
const taskSlice = createSlice({
  name: "tasks",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.goalId] = action.payload.tasks;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { goalId } = action.payload;
        if (!state[goalId]) state[goalId] = [];
        state[goalId].push(action.payload);
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const taskId = action.payload;
        for (const goalId in state) {
          state[goalId] = state[goalId].filter((task) => task._id !== taskId);
        }
      })
      .addCase(clearTasksByGoal.fulfilled, (state, action) => {
        delete state[action.payload];
      });
  },
});

export default taskSlice.reducer;
