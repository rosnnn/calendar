import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchGoals,
  fetchTasks,
  addGoal,
  addTask,
  clearTasksByGoal,
} from '../redux/slices/goalSlice';
import axios from 'axios';

const Sidebar = () => {
  const dispatch = useDispatch();
  const { goals, tasksByGoal } = useSelector((state) => state.goals);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [newGoal, setNewGoal] = useState('');
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal._id);
    dispatch(fetchTasks(goal._id));
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    const color = getRandomColor();
    const resultAction = await dispatch(addGoal({ name: newGoal, color }));
    const addedGoal = resultAction.payload;
    if (addedGoal && addedGoal._id) {
      setSelectedGoal(addedGoal._id);
      dispatch(fetchTasks(addedGoal._id));
    }
    setNewGoal('');
  };

  const handleAddTask = async () => {
    if (!newTask.trim() || !selectedGoal) return;
    await dispatch(addTask({ goalId: selectedGoal, name: newTask }));
    dispatch(fetchTasks(selectedGoal)); // Refresh task list after add ✅
    setNewTask('');
  };

  const handleDeleteGoal = async (goalId) => {
    await axios.delete(`https://calendar-server-kuvx.onrender.com/api/data/goals/${goalId}`);
    dispatch(fetchGoals());
    dispatch(clearTasksByGoal(goalId));
    if (selectedGoal === goalId) setSelectedGoal(null);
  };

  const tasks = selectedGoal ? tasksByGoal[selectedGoal] || [] : [];

  return (
    <div className="sidebar">
      <h3>Goals</h3>
      <div>
        <input
          type="text"
          placeholder="New goal"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
        />
        <button onClick={handleAddGoal}>Add Goal</button>
      </div>

      <ul className="goals-list">
        {goals.map((goal) => (
            <li
            key={goal._id}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: selectedGoal === goal._id ? goal.color : '#eee',
                color: selectedGoal === goal._id ? '#fff' : '#000',
                padding: '6px 10px',
                marginBottom: '6px',
                borderRadius: '6px',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
            }}
            >
            <span
                style={{ flex: 1 }}
                onClick={() => handleGoalClick(goal)}
            >
                {goal.name}
            </span>

            {/* DELETE BUTTON STYLE FIXED */}
            <button
                style={{
                    width: '26px',
                    marginLeft: '10px',
                    padding: '2px 6px',
                    background: 'transparent',
                    border: '1px solid black',
                    color: selectedGoal === goal._id ? '#fff' : '#000',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '14px',
                    lineHeight: '1',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteGoal(goal._id);
                }}
                title="Delete Goal"
                >
                ✕
            </button>

            </li>
        ))}
        </ul>


      {selectedGoal && (
        <>
          <h4>Tasks</h4>
          <div>
            <input
              type="text"
              placeholder="New task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
          </div>
        </>
      )}

      <ul className="tasks-list">
        {tasks.map((task) => (
          <li
            key={task._id}
            draggable
            onDragStart={(e) => {
              const goalColor = goals.find((g) => g._id === selectedGoal)?.color || '#000';
              const payload = {
                title: task.name,
                goalId: selectedGoal,
                color: goalColor,
              };
              e.dataTransfer.setData('application/json', JSON.stringify(payload));
              window._lastDragData = payload;
            }}
            style={{
              borderLeft: `5px solid ${
                goals.find((g) => g._id === selectedGoal)?.color || '#000'
              }`,
              padding: '6px 10px',
              margin: '4px 0',
              background: '#f5f5f5',
              borderRadius: '4px',
              cursor: 'grab',
            }}
          >
            {task.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

const getRandomColor = () => {
  const colors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default Sidebar;
