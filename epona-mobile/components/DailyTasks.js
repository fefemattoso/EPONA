import React, { useState } from 'react';

function DailyTasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask) {
      setTasks([...tasks, { task: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleComplete = (index) => {
    const updatedTasks = tasks.map((task, i) => 
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div className="daily-tasks">
      <h2>Lista de Tarefas Diárias</h2>
      <div className="input-container">
        <input 
          type="text" 
          placeholder="Adicionar tarefa diária" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button onClick={addTask}>Adicionar</button>
      </div>
      <div className="task-list">
        <ul>
          {tasks.map((task, index) => (
            <li key={index} 
                onClick={() => toggleComplete(index)}
                style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
              {task.task}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default DailyTasks;
