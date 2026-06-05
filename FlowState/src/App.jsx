import React from 'react';
import Timeline from './components/Timeline';
import FocusArena from './components/FocusArena';
import styles from './App.module.css';

const mockDailyPlan = {
  readinessScore: 84,
  schedule: [
    { id: 1, timeSlot: '09:00 AM', title: 'Core Architecture Design', description: 'Draft Spring Boot schema and workflow orchestration gates.', duration: 90, cognitiveLoad: 'deep' },
    { id: 2, timeSlot: '10:30 AM', title: 'Decompress & Hydrate', description: 'Walk around, allow baseline focus to recover.', duration: 20, cognitiveLoad: 'rest' },
    { id: 3, timeSlot: '10:50 AM', title: 'React UI Hook Integration', description: 'Wire up global state managers and handle local storage wrappers.', duration: 90, cognitiveLoad: 'deep' },
    { id: 4, timeSlot: '12:20 PM', title: 'Inbox Triage & Review', description: 'Low cognitive load tasks, respond to async syncs.', duration: 30, cognitiveLoad: 'low' },
  ]
};

export default function App() {
  return (
    <div className={styles.container}>{/* ... */}
      <header className={styles.header}>
        <h1 className={styles.appTitle}>Biometric Planner</h1>{/* header */}
        <p className={styles.statusLabel}>placeholder</p>
      </header>

        {/* Motivational Image Banner Section */}
      <div className={styles.motivationBanner}>
        <img 
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" 
          alt="Motivation Background" 
          className={styles.bannerImg}
        />
        <div className={styles.bannerOverlay}>
          <p className={styles.quoteText}>"Success at anything will always come down to this: Focus and Effort. And we control both"</p>
          <span className={styles.quoteAuthor}>- Dwayne Johnson</span>
        </div>
      </div>

      <main className={styles.mainGrid}>
        <section className={styles.timelineSection}>
          <Timeline dailyPlan={mockDailyPlan} />{/* all the todos */}
        </section>

      
        
        <aside className={styles.asideSection}>
          <FocusArena /> {/* pomodoro and ultradian timer */}
        </aside>
      </main>
    </div>
  );
}