import './App.css';
import AddTaskForm from './AddTaskForm';
import { Task } from './types';
import React, { useEffect, useState } from 'react';

function App() {
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
    const priorityOrder = { high: 1, medium: 2, low: 3 };

    updatedTasks.sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });

    setTasks(updatedTasks);
  };

  return (
    <div className="App">
      <h1>Smart Scheduler</h1>
      <AddTaskForm onAddTask={addTask} />

      <h2>Your Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks added yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li key={index}>
              <strong>{task.taskName}</strong> | {task.duration}h | Due: {task.deadline} | Priority: {task.priority}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
