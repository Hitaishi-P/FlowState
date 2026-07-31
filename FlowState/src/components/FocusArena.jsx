import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useTimer } from '../hooks/useTimer';
import styles from './FocusArena.module.css';

export default function FocusArena() {
  const { activeTask, timerMode, setTimerMode, isTimerRunning } = useAppStore();
  
  const defaultMinutes = timerMode === 'ultradian' ? 90 : 25;
  const { formatTime, startTimer, pauseTimer, resetTimer } = useTimer(defaultMinutes);

  useEffect(() => {
    resetTimer(defaultMinutes);
  }, [timerMode]);

  return (
<div className={styles.page}>
<div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Focus Arena</h2>
        <div className={styles.toggleContainer}>
          <button 
            onClick={() => setTimerMode('pomodoro')}
            className={`${styles.toggleBtn} ${timerMode === 'pomodoro' ? styles.toggleBtnActive : ''}`}
          >
            POMODORO
          </button>
          <button 
            onClick={() => setTimerMode('ultradian')}
            className={`${styles.toggleBtn} ${timerMode === 'ultradian' ? styles.toggleBtnActive : ''}`}
          >
            ULTRADIAN
          </button>
        </div>
      </div>

      {activeTask ? (
        <div className={styles.arenaContent}>
          <div>
            <span className={styles.taskTag}>Loop: {activeTask.title}</span>
          </div>

          <div className={styles.countdown}>{formatTime()}</div>

          <div className={styles.btnGroup}>
            {isTimerRunning ? (
              <button onClick={pauseTimer} className={`${styles.btn} ${styles.btnSecondary}`}>
                Pause
              </button>
            ) : (
              <button onClick={startTimer} className={`${styles.btn} ${styles.btnPrimary}`}>
                Focus
              </button>
            )}
            <button onClick={() => resetTimer(defaultMinutes)} className={`${styles.btn} ${styles.btnOutline}`}>
              Reset
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p style={{ fontSize: '0.875rem', maxWidth: '240px', margin: '0 auto' }}>
            Select a task from your timeline to initialize the focus block.
          </p>
        </div>
      )}
    </div>
    </div>
  );
}