import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createEvent, updateEvent } from '../redux/slices/eventSlice';

const categories = [
  { label: 'Exercise', value: 'exercise', color: '#52b788' },
  { label: 'Eating', value: 'eating', color: '#ffafcc' },
  { label: 'Work', value: 'work', color: '#4361ee' },
  { label: 'Relax', value: 'relax', color: '#f9c74f' },
  { label: 'Family', value: 'family', color: '#f94144' },
  { label: 'Social', value: 'social', color: '#9d4edd' },
];

const CreateEventModal = ({ data, onClose, onDelete }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: data.title || '',
    category: data.category || 'work',
    start: data.start,
    end: data.end,
    color: data.color || '',
    goalId: data.goalId || null, // ✅ Support task drops
  });

  useEffect(() => {
    if (data.isEdit) {
      setFormData({
        title: data.title,
        category: data.category || 'work',
        start: data.start,
        end: data.end,
        color: data.color || '',
        goalId: data.goalId || null,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        title: data.title || '',
        start: data.start,
        end: data.end,
        color: data.color || '',
        goalId: data.goalId || null,
      }));
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const getCategoryColor = (category) => {
    return categories.find((c) => c.value === category)?.color || '#ccc';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const color = formData.color || getCategoryColor(formData.category);

    const eventPayload = {
      ...formData,
      start: new Date(formData.start),
      end: new Date(formData.end),
      color,
    };

    if (data.isEdit) {
      dispatch(updateEvent({ id: data._id, updates: eventPayload }));
    } else {
      dispatch(createEvent(eventPayload));
    }

    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>{data.isEdit ? 'Edit Event' : 'Create Event'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          <input
            type="datetime-local"
            name="start"
            value={momentToInput(formData.start)}
            onChange={handleChange}
          />
          <input
            type="datetime-local"
            name="end"
            value={momentToInput(formData.end)}
            onChange={handleChange}
          />
          <div className="buttons">
            <button type="submit">{data.isEdit ? 'Update' : 'Create'}</button>
            {data.isEdit && (
              <button type="button" onClick={() => onDelete(data._id)} className="danger">
                Delete
              </button>
            )}
            <button type="button" onClick={onClose} className="outline">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const momentToInput = (date) => {
  const d = new Date(date);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
};

export default CreateEventModal;
