import React from "react";
import styles from "./StatsView.module.css";

// Mock data until this is wired to real task history (e.g. from db.json)
const mockWeekStats = {
  totalFocusMinutes: 645,
  tasksCompleted: 18,
  currentStreak: 4,
  loadBreakdown: [
    { label: "Deep", key: "deep", minutes: 320 },
    { label: "Medium", key: "medium", minutes: 180 },
    { label: "Low", key: "low", minutes: 85 },
    { label: "Rest", key: "rest", minutes: 60 },
  ],
  dailyMinutes: [
    { day: "Mon", minutes: 95 },
    { day: "Tue", minutes: 120 },
    { day: "Wed", minutes: 60 },
    { day: "Thu", minutes: 140 },
    { day: "Fri", minutes: 90 },
    { day: "Sat", minutes: 40 },
    { day: "Sun", minutes: 100 },
  ],
};

export default function StatsView() {
  const { totalFocusMinutes, tasksCompleted, currentStreak, loadBreakdown, dailyMinutes } =
    mockWeekStats;

  const totalLoadMinutes = loadBreakdown.reduce((sum, l) => sum + l.minutes, 0);
  const maxDayMinutes = Math.max(...dailyMinutes.map((d) => d.minutes));

  const formatHours = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  return (
    <div className={styles.page}>
      <div className={styles.summaryRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{formatHours(totalFocusMinutes)}</span>
          <span className={styles.statLabel}>Focus Time</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{tasksCompleted}</span>
          <span className={styles.statLabel}>Tasks Done</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>🔥 {currentStreak}</span>
          <span className={styles.statLabel}>Day Streak</span>
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>This Week</h3>
        <div className={styles.barChart}>
          {dailyMinutes.map((d, i) => (
            <div key={i} className={styles.barCol}>
              <div className={styles.barTrack}>
                <div
                  className={styles.bar}
                  style={{ height: `${(d.minutes / maxDayMinutes) * 100}%` }}
                />
              </div>
              <span className={styles.barLabel}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.card}>
        <h3 className={styles.cardTitle}>Cognitive Load Distribution</h3>
        <div className={styles.loadStack}>
          {loadBreakdown.map((l, i) => (
            <div
              key={i}
              className={`${styles.loadSegment} ${styles[l.key]}`}
              style={{ width: `${(l.minutes / totalLoadMinutes) * 100}%` }}
            />
          ))}
        </div>
        <div className={styles.loadLegend}>
          {loadBreakdown.map((l, i) => (
            <div key={i} className={styles.legendItem}>
              <span className={`${styles.legendDot} ${styles[l.key]}`} />
              <span className={styles.legendLabel}>{l.label}</span>
              <span className={styles.legendValue}>{formatHours(l.minutes)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}