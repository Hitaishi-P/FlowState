import React, { useState, useEffect, useMemo } from "react";
import { getSessions } from "../services/dataApi";
import styles from "./StatsView.module.css";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const LOAD_LABELS = { deep: "Deep", medium: "Medium", low: "Low", rest: "Rest" };

export default function StatsView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getSessions()
      .then((data) => { if (!cancelled) setSessions(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const stats = useMemo(() => {
    const totalFocusMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const tasksCompleted = sessions.length;

    const loadMap = {};
    sessions.forEach((s) => {
      loadMap[s.cognitiveLoad] = (loadMap[s.cognitiveLoad] || 0) + s.durationMinutes;
    });
    const loadBreakdown = Object.entries(loadMap).map(([key, minutes]) => ({
      key,
      minutes,
      label: LOAD_LABELS[key] || key,
    }));

    const today = new Date();
    const dailyMinutes = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const minutes = sessions
        .filter((s) => s.completedAt?.slice(0, 10) === key)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      dailyMinutes.push({ day: DAY_LABELS[d.getDay()], minutes });
    }

    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const hasSession = sessions.some((s) => s.completedAt?.slice(0, 10) === key);
      if (hasSession) currentStreak++;
      else break;
    }

    return { totalFocusMinutes, tasksCompleted, currentStreak, loadBreakdown, dailyMinutes };
  }, [sessions]);

  const { totalFocusMinutes, tasksCompleted, currentStreak, loadBreakdown, dailyMinutes } = stats;
  const totalLoadMinutes = loadBreakdown.reduce((sum, l) => sum + l.minutes, 0) || 1;
  const maxDayMinutes = Math.max(1, ...dailyMinutes.map((d) => d.minutes));

  const formatHours = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  if (loading) return <div className={styles.page}>Loading stats…</div>;
  if (error) return <div className={styles.page}>Couldn't load stats: {error}</div>;

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
                <div className={styles.bar} style={{ height: `${(d.minutes / maxDayMinutes) * 100}%` }} />
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
            <div key={i} className={`${styles.loadSegment} ${styles[l.key]}`} style={{ width: `${(l.minutes / totalLoadMinutes) * 100}%` }} />
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