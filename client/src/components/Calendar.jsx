import React, { useState, useEffect } from 'react';
import {
  Calendar as BigCalendar,
  momentLocalizer,
} from 'react-big-calendar';
import moment from 'moment';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchEvents,
  updateEvent,
  deleteEvent,
} from '../redux/slices/eventSlice';
import CreateEventModal from './CreateEventModal';

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(BigCalendar);

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalData, setModalData] = useState({ open: false });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleSelectSlot = ({ start, end }) => {
    setModalData({ open: true, start, end, isEdit: false });
  };

  const handleSelectEvent = (event) => {
    setModalData({ open: true, ...event, isEdit: true });
    setSelectedEvent(event);
  };

  const handleEventDrop = ({ event, start, end }) => {
    dispatch(updateEvent({ id: event._id, updates: { start, end } }));
  };

  const handleEventResize = ({ event, start, end }) => {
    dispatch(updateEvent({ id: event._id, updates: { start, end } }));
  };

  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    setModalData({ open: false });
  };

  const handleDropFromOutside = ({ start, end, allDay }) => {
    const data = window._lastDragData;
    if (!data) return;

    const { title, color, goalId } = data;

    // SAFETY CHECK — avoid getBoundingClientRect crash
    if (typeof document === 'undefined' || !document.body) return;

    setTimeout(() => {
      try {
        setModalData({
          open: true,
          title,
          color,
          goalId,
          start,
          end,
          allDay,
          isEdit: false,
        });
      } catch (err) {
        console.error("Drop/modal error suppressed:", err);
      } finally {
        window._lastDragData = null;
      }
    }, 0); // safe delay
  };

  const dragFromOutsideItem = () => window._lastDragData || null;

  return (
    <div style={{ height: '90vh' }}>
      <DnDCalendar
        localizer={localizer}
        events={events.map((e) => ({
          ...e,
          start: new Date(e.start),
          end: new Date(e.end),
          title: e.title,
          allDay: false,
        }))}
        selectable
        resizable
        defaultView="week"
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onDropFromOutside={handleDropFromOutside}
        dragFromOutsideItem={dragFromOutsideItem}
        style={{ padding: '20px' }}
      />

      {modalData.open && (
        <CreateEventModal
          data={modalData}
          onClose={() => setModalData({ open: false })}
          onDelete={() => handleDelete(modalData._id)}
        />
      )}
    </div>
  );
};

export default Calendar;
