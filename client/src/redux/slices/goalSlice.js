// goalSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.baseURL = "https://calendar-server-kuvx.onrender.com";

// Thunks
export const fetchGoals = createAsyncThunk('goals/fetchGoals', async () => {
  const res = await axios.get('/api/data/goals');
  return res.data;
});

export const fetchTasks = createAsyncThunk('goals/fetchTasks', async (goalId) => {
  const res = await axios.get(`/api/data/tasks/${goalId}`);
  return { goalId, tasks: res.data };
});

export const addGoal = createAsyncThunk('goals/addGoal', async (goalData) => {
  const res = await axios.post('/api/data/goals', goalData);
  return res.data;
});

export const addTask = createAsyncThunk('goals/addTask', async (taskData) => {
  const res = await axios.post('/api/data/tasks', taskData);
  return res.data;
});

// NEW: Delete goal
export const deleteGoal = createAsyncThunk('goals/deleteGoal', async (goalId) => {
  await axios.delete(`/api/data/goals/${goalId}`);
  return goalId;
});

// Slice
const goalSlice = createSlice({
  name: 'goals',
  initialState: {
    goals: [],
    tasksByGoal: {},
    status: 'idle',
  },
  reducers: {
    clearTasksByGoal: (state, action) => {
      delete state.tasksByGoal[action.payload];
    },
    clearAllGoals: (state) => {
      state.goals = [];
      state.tasksByGoal = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.goals = action.payload;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.tasksByGoal[action.payload.goalId] = action.payload.tasks;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        state.goals.push(action.payload);
      })
      .addCase(addTask.fulfilled, (state, action) => {
        const { goalId } = action.payload;
        if (!state.tasksByGoal[goalId]) {
          state.tasksByGoal[goalId] = [];
        }
        state.tasksByGoal[goalId].push(action.payload);
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((g) => g._id !== action.payload);
        delete state.tasksByGoal[action.payload];
      });
  },
});

// 👇 EXPORT new reducer and action
export const { clearTasksByGoal, clearAllGoals } = goalSlice.actions;
export default goalSlice.reducer;
