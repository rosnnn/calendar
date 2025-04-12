import React from 'react';
import Calendar from './components/Calendar';
import Sidebar from './components/Sidebar';
import './styles.css';
import { useDispatch } from 'react-redux';
import { createEvent } from './redux/slices/eventSlice';

const App = () => {
  const dispatch = useDispatch();

  const handleDrop = (e) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData('application/json'));

    const calendarEl = document.querySelector('.calendar');
    if (!calendarEl) {
      console.warn('Calendar element not found during drop.');
      return;
    }

    const calendarRect = calendarEl.getBoundingClientRect();
    const y = e.clientY - calendarRect.top;
    const hour = Math.floor((y / calendarRect.height) * 24);
    const start = new Date();
    start.setHours(hour);
    start.setMinutes(0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);

    dispatch(
      createEvent({
        title: taskData.title,
        start,
        end,
        category: 'work',
        color: taskData.color,
      })
    );
  };

  return (
    <div className="app-wrapper">
      <div className="app" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
        <Sidebar />
        <div className="calendar-container">
          <Calendar />
        </div>
      </div>
    </div>
  );
};

export default App;
