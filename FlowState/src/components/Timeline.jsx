import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import TaskForm from './TaskForm';
import styles from './Timeline.module.css';

export default function Timeline({ dailyPlan, onRefresh }) {
  const { setActiveTask, activeTask } = useAppStore();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.page}>
        <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Today's Optimized Schedule</h2>
        <span className={styles.badge}>Readiness: {dailyPlan.readinessScore}/100</span>
      </div>

      <div className={styles.timelineTree}>
        {dailyPlan.schedule.map((item, index) => {
          const isActive = activeTask?.id === item.id;
          const loadClass = styles[item.cognitiveLoad] || '';
          const activeBoxClass = isActive ? styles.taskBoxActive : '';

          return (
            <div key={item.id || index} className={styles.itemWrapper}>
              <div className={`${styles.node} ${isActive ? styles.nodeActive : ''}`} />
              
              <div 
                onClick={() => item.cognitiveLoad !== 'rest' && setActiveTask(item)}
                className={`${styles.taskBox} ${loadClass} ${activeBoxClass}`}
              >
                <div>
                  <span className={styles.timeSlot}>{item.timeSlot}</span>
                  <h3 className={styles.taskTitle}>{item.title}</h3>
                  {item.description && <p className={styles.taskDesc}>{item.description}</p>}
                </div>
                <div className={styles.metaRight}>
                  <span className={styles.loadLabel}>{item.cognitiveLoad}</span>
                  <span className={styles.duration}>{item.duration}m</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>

      {/* Button fixed perfectly to the bottom right corner of the card container */}
      <button 
        className={styles.floatingAddBtn}
        onClick={() => setShowForm(!showForm)}
      >
        <span>{showForm ? '✕ Close' : '＋ Add Task'}</span>
      </button>

      {/* Conditionally show the input panel right inside the card layout */}
      {showForm && (
        <div style={{ marginTop: '24px' }}>
          <TaskForm onTaskAdded={() => { setShowForm(false); if(onRefresh) onRefresh(); }} />
        </div>
      )}
    </div>
  );
}