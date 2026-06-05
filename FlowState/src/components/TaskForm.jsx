import React, { useState } from 'react';
import styles from './TaskForm.module.css';

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState('');
  const [cognitiveLoad, setCognitiveLoad] = useState('medium');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      title,
      cognitiveLoad,
      timeSlot: "Pending AI...",
      duration: cognitiveLoad === 'deep' ? 90 : 30,
      description: "Manually injected task."
    };

    // Sending a POST request to save data to db.json dynamically
    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
    .then(res => res.json())
    .then(data => {
      alert('Task pushed to local server database!');
      setTitle('');
      if (onTaskAdded) onTaskAdded(); // Triggers a UI refresh
    });
  };

  return (
    <div className={styles.formCard}>
      <h3 className={styles.title}>Quick Task Backlog</h3>
      <form onSubmit={handleSubmit} className={styles.inputGroup}>
        <input 
          type="text" 
          placeholder="What needs to get done?" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <select 
          value={cognitiveLoad} 
          onChange={(e) => setCognitiveLoad(e.target.value)}
          className={styles.select}
        >
          <option value="low">Low Load (Admin/Emails)</option>
          <option value="medium">Medium Load (Routine Work)</option>
          <option value="deep">Deep Work (Heavy Coding/Math)</option>
        </select>
        <button type="submit" className={styles.btn}>Add to Server</button>
      </form>
    </div>
  );
}