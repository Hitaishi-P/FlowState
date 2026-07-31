import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import TodoPage from "./pages/TodoPage";
import TimerPage from "./pages/TimerPage";
import CalendarPage from "./pages/CalendarPage";
import StatsPage from "./pages/StatsPage";

import BottomNav from "./components/BottomNav";

import styles from "./App.module.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.appContainer}>
        <main className={styles.pageContainer}>
          <Routes>
            <Route path="/" element={<Navigate to="/todo" replace />} />
            <Route path="/todo" element={<TodoPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </BrowserRouter>
  );
}