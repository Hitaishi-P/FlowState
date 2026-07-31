import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.css";

export default function BottomNav() {
  return (
    <nav className={styles.nav}>

      <NavLink
        to="/todo"
        className={({ isActive }) =>
          isActive
            ? `${styles.link} ${styles.active}`
            : styles.link
        }
      >
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Todo</span>
      </NavLink>

      <NavLink
        to="/timer"
        className={({ isActive }) =>
          isActive
            ? `${styles.link} ${styles.active}`
            : styles.link
        }
      >
        <span className={styles.icon}>⏱</span>
        <span className={styles.label}>Timer</span>
      </NavLink>

      <NavLink
        to="/calendar"
        className={({ isActive }) =>
          isActive
            ? `${styles.link} ${styles.active}`
            : styles.link
        }
      >
        <span className={styles.icon}>📅</span>
        <span className={styles.label}>Calendar</span>
      </NavLink>

      <NavLink
        to="/stats"
        className={({ isActive }) =>
          isActive
            ? `${styles.link} ${styles.active}`
            : styles.link
        }
      >
        <span className={styles.icon}>📊</span>
        <span className={styles.label}>Stats</span>
      </NavLink>

    </nav>
  );
}