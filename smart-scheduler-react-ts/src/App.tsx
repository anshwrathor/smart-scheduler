import './App.css';
import AddTaskForm from './AddTaskForm';
import { Task } from './types';
import React, { useEffect, useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [dailyHours, setDailyHours] = useState(4); // Default daily hours
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? (JSON.parse(savedTasks) as Task[]) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks];

    if (editIndex !== null) {
      updatedTasks[editIndex] = newTask;
      setEditIndex(null);
    } else {
      updatedTasks.push(newTask);
    }

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    updatedTasks.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    setTasks(updatedTasks);
  };

  const editTask = (index: number) => {
    setEditIndex(index);
  };

  const deleteTask = (index: number) => {
    const updatedTasks = [...tasks];
    updatedTasks.splice(index, 1);
    setTasks(updatedTasks);
  };

  const getScheduledTasks = () => {
    const schedule: { [key: string]: Task[] } = {};
    daysOfWeek.forEach(day => {
      schedule[day] = [];
    });

    const hoursUsedPerDay: { [key: string]: number } = {};
    daysOfWeek.forEach(day => {
      hoursUsedPerDay[day] = 0;
    });

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedTasks = [...tasks].sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    const todayIndex = new Date().getDay(); // 0 = Sunday

    sortedTasks.forEach(task => {
      for (let i = 0; i < 7; i++) {
        const dayIndex = (todayIndex + i) % 7;
        const dayName = daysOfWeek[dayIndex];

        if (hoursUsedPerDay[dayName] + task.duration <= dailyHours) {
          schedule[dayName].push(task);
          hoursUsedPerDay[dayName] += task.duration;
          break;
        }
      }
    });

    return schedule;
  };

  const [aiRecommendations, setAiRecommendations] = useState<Task[]>([]);

const getAiRecommendation = () => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const availableTasks = tasks.filter(task => {
    return new Date(task.deadline) >= today;
  });

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  const sorted = [...availableTasks].sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  let hoursLeft = dailyHours;
  const recommended: Task[] = [];

  for (const task of sorted) {
    if (hoursLeft >= task.duration) {
      recommended.push(task);
      hoursLeft -= task.duration;
    }
  }

  setAiRecommendations(recommended);
};


  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <button onClick={toggleDarkMode} style={{ marginBottom: '1rem' }}>
        {darkMode ? '☀︎' : '☾'}
      </button>

      <h1>Smart Scheduler</h1>

      {/* Daily Available Hours Input */}
      <div style={{ marginBottom: '2rem' }}>
        <label htmlFor="dailyHours">Available hours per day:</label>
        <input
          type="number"
          id="dailyHours"
          value={dailyHours}
          onChange={(e) => setDailyHours(Number(e.target.value))}
          min={1}
          max={12}
          style={{ marginLeft: '10px', width: '60px' }}
        />
      </div>

      <button
        onClick={getAiRecommendation}
        style={{ marginBottom: '2rem', backgroundColor: '#673ab7', color: '#fff', border: 'none', padding: '10px 15px', borderRadius: '6px', cursor: 'pointer' }}>
        🤖 AI: What should I do today?
      </button> 

      {/* Task Input Form */}
      <AddTaskForm
        onAddTask={addTask}
        editIndex={editIndex}
        taskToEdit={editIndex !== null ? tasks[editIndex] : null}
      />

      {/* Task List */}
      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li
              key={index}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <button
                onClick={() => editTask(index)}
                style={{
                  marginRight: '10px',
                  backgroundColor: '#1976d2',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Edit
              </button>
              <span>
                <strong>{task.taskName}</strong> | {task.duration}h | Due: {task.deadline} | Priority: {task.priority}
              </span>
              <button
                onClick={() => deleteTask(index)}
                style={{
                  marginLeft: '20px',
                  backgroundColor: '#e53935',
                  color: 'white',
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Weekly Planner Grid */}
      <h2>Weekly Planner</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
        {daysOfWeek.map(day => (
          <div key={day} style={{ background: 'white', padding: '10px', borderRadius: '8px', minHeight: '150px' }}>
            <h4>{day}</h4>
            {getScheduledTasks()[day].length === 0 ? (
              <p style={{ fontSize: '14px', color: '#999' }}>No tasks</p>
            ) : (
              getScheduledTasks()[day].map((task, i) => (
                <div key={i} style={{ marginBottom: '8px', fontSize: '14px' }}>
                  ✅ {task.taskName} ({task.duration}h)
                </div>
              ))
            )}
          </div>
        ))}
      </div>
      {aiRecommendations.length > 0 && (
      <div style={{ marginTop: '2rem' }}>
        <h2>🤖 AI Recommendations for Today</h2>
        <ul>
          {aiRecommendations.map((task, index) => (
            <li key={index}>
              <strong>{task.taskName}</strong> ({task.duration}h) — {task.priority} priority, due {task.deadline}
            </li>
          ))}
        </ul>
      </div>
    )}
    </div>
  );
}

export default App;
