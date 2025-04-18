import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const pastelColors = [
  'rgba(0, 123, 255, 0.8)',    // blue
  'rgba(40, 167, 69, 0.8)',    // green
  'rgba(255, 193, 7, 0.8)',    // yellow
  'rgba(255, 87, 34, 0.8)',    // orange
  'rgba(108, 117, 125, 0.8)',  // gray
];

const getRandomPastelColor = () =>
  pastelColors[Math.floor(Math.random() * pastelColors.length)];

const API_URL =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_API_URL) ||
  'http://localhost:5000';


// 🟡 Assign color if missing
export const fetchEvents = createAsyncThunk('events/fetch', async () => {
  const res = await axios.get(`${API_URL}/api/events`);
  return res.data.map((event) => ({
    ...event,
    color: event.color || getRandomPastelColor(),
  }));
});

export const createEvent = createAsyncThunk('events/create', async (eventData) => {
  const dataWithColor = {
    ...eventData,
    color: eventData.color || getRandomPastelColor(),
  };

  const res = await axios.post(`${API_URL}/api/events`, dataWithColor);
  return res.data;
});

export const updateEvent = createAsyncThunk('events/update', async ({ id, updates }) => {
  const res = await axios.put(`${API_URL}/api/events/${id}`, updates);
  return res.data;
});

export const deleteEvent = createAsyncThunk('events/delete', async (id) => {
  await axios.delete(`${API_URL}/api/events/${id}`);
  return id;
});

const eventSlice = createSlice({
  name: 'events',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.fulfilled, (state, action) => action.payload)
      .addCase(createEvent.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        const index = state.findIndex((e) => e._id === action.payload._id);
        if (index !== -1) state[index] = action.payload;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        return state.filter((e) => e._id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
