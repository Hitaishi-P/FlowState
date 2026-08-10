import React, { useState, useEffect, useMemo } from "react";
import { useAppStore } from "../store/useAppStore";
import { getDailyPlans } from "../services/dataApi";
import styles from "./CalendarView.module.css";

function getMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const startWeekday = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

function formatKey(year, month, day) {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

export default function CalendarView() {
  const { setActiveTask } = useAppStore();
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedKey, setSelectedKey] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDailyPlans()
      .then((data) => { if (!cancelled) setPlans(data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const monthTasks = useMemo(() => {
    const map = {};
    plans.forEach((plan) => {
      if (!plan.date) return;
      map[plan.date] = (plan.schedule || []).map((s) => ({
        title: s.title,
        cognitiveLoad: s.cognitiveLoad,
      }));
    });
    return map;
  }, [plans]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = getMonthGrid(year, month);
  const monthLabel = viewDate.toLocaleString("default", { month: "long", year: "numeric" });

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedTasks = selectedKey ? monthTasks[selectedKey] || [] : [];

  if (loading) return <div className={styles.page}>Loading calendar…</div>;
  if (error) return <div className={styles.page}>Couldn't load calendar: {error}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <button className={styles.navBtn} onClick={goPrevMonth}>‹</button>
          <h2 className={styles.title}>{monthLabel}</h2>
          <button className={styles.navBtn} onClick={goNextMonth}>›</button>
        </div>

        <div className={styles.weekdayRow}>
          {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
            <span key={i} className={styles.weekday}>{d}</span>
          ))}
        </div>

        <div className={styles.grid}>
          {cells.map((day, i) => {
            if (day === null) return <div key={i} className={styles.emptyCell} />;

            const key = formatKey(year, month, day);
            const dayTasks = monthTasks[key] || [];
            const isToday =
              day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = key === selectedKey;

            return (
              <button
                key={i}
                className={`${styles.dayCell} ${isToday ? styles.today : ""} ${isSelected ? styles.selected : ""}`}
                onClick={() => setSelectedKey(key)}
              >
                <span className={styles.dayNumber}>{day}</span>
                <div className={styles.dotRow}>
                  {dayTasks.slice(0, 3).map((t, idx) => (
                    <span key={idx} className={`${styles.dot} ${styles[t.cognitiveLoad] || ""}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedKey && (
        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>{selectedKey}</h3>
          {selectedTasks.length === 0 ? (
            <p className={styles.emptyDetail}>No tasks scheduled.</p>
          ) : (
            selectedTasks.map((t, idx) => (
              <div
                key={idx}
                className={`${styles.detailTask} ${styles[t.cognitiveLoad] || ""}`}
                onClick={() => setActiveTask(t)}
              >
                <span>{t.title}</span>
                <span className={styles.detailLoad}>{t.cognitiveLoad}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}