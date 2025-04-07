import React, { useState, useEffect } from 'react';
import { Task } from './types';

interface AddTaskFormProps {
  onAddTask: (task: Task) => void;
  editIndex: number | null;
  taskToEdit: Task | null;
}      

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onAddTask, editIndex, taskToEdit }) => {
  const [task, setTask] = useState<Task>({
    taskName: '',
    duration: 1,
    deadline: '',
    priority: 'medium',
  });

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
    }
  }, [taskToEdit]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTask(prev => ({
      ...prev,
      [name]: name === 'duration' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask(task);
    setTask({
      taskName: '',
      duration: 1,
      deadline: '',
      priority: 'medium',
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="taskName" placeholder="Task Name" value={task.taskName} onChange={handleChange} required />
      <input type="number" name="duration" placeholder="Duration (hrs)" value={task.duration} onChange={handleChange} step="0.5" min="0.5" required />
      <input type="date" name="deadline" value={task.deadline} onChange={handleChange} required />
      <select name="priority" value={task.priority} onChange={handleChange}>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <button type="submit">{editIndex !== null ? 'Update Task' : 'Add Task'}</button>
    </form>
  );
};

export default AddTaskForm;
