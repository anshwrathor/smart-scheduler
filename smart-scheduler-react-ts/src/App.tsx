import './App.css';
import AddTaskForm from './AddTaskForm';
import { Task } from './types';
import React, { useEffect, useState } from 'react';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Load tasks from localStorage on initial render
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? (JSON.parse(savedTasks) as Task[]) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Task) => {
    const updatedTasks = [...tasks, newTask];
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

  const [editIndex, setEditIndex] = useState<number | null>(null);

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      
      <button onClick={toggleDarkMode} style={{ marginBottom: '1rem' }}>
        {darkMode ? '☀︎' : '☾'} 
      </button>
      <h1>Smart Scheduler</h1>
    
      <AddTaskForm onAddTask={addTask} editIndex={editIndex} taskToEdit={editIndex !== null ? tasks[editIndex] : null} />
      <h2>Your Tasks</h2>
      
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              
              <button
                onClick={() => editTask(index)}
                style={{ marginRight: '10px', backgroundColor: '#1976d2', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                Edit
              </button>
              <span>
              <strong>{task.taskName}</strong> | {task.duration}h | Due: {task.deadline} | Priority: {task.priority}
              </span>
              <button onClick={() => deleteTask(index)} style={{ marginLeft: '20px', backgroundColor: '#e53935', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                Delete 
              </button>

            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
