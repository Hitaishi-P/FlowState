# Flowstate
## Project Specification & Architecture

---

## 1. Vision

A personalized productivity app for students that combines:
- **Canvas LMS integration** — pulls real assignment deadlines automatically
- **Health-aware scheduling** — pushes recommended start dates *earlier* than the Canvas deadline based on the student's sleep, fatigue, and concentration data, so they're not cramming
- **Flexible focus timer** — Pomodoro (25 min) or Ultradian (90 min) cycles, usable for any task, not just Canvas-imported ones
- **Stats/progress page** — shows completed tasks over time, streaks, and focus time logged

The core differentiator: **this isn't just a to-do list mirroring Canvas — it's a workload-smoothing layer that sits on top of Canvas and adjusts your personal schedule based on how you're actually doing.**

---

## 2. App Structure — Pages & Navigation

Bottom navigation bar (icon-based, mobile-first, but works on desktop too). Clicking an icon routes to that page. Suggested order:

| # | Page | Icon idea | Purpose |
|---|------|-----------|---------|
| 1 | **To-Do / Timeline** | checklist / list icon | Master task list — merges Canvas-imported + manually added tasks, sorted by adjusted (health-aware) time slot |
| 2 | **Focus Timer** | hourglass / clock icon | Pomodoro/Ultradian timer bound to whichever task is "active" |
| 3 | **Calendar** | calendar icon | Month/week view of all deadlines — real Canvas deadline vs. recommended personal deadline shown distinctly |
| 4 | **Stats** | bar-chart / trophy icon | Completed task count, streaks, total focus minutes, load breakdown (deep/medium/low) |

### Navigation component
- New `BottomNav.jsx` + `BottomNav.module.css`
- Uses a router (recommend **React Router** — `react-router-dom`) with routes:
  - `/` or `/todo` → Timeline (your existing `Timeline.jsx`, renamed conceptually to "To-Do")
  - `/timer` → your existing `FocusArena.jsx`
  - `/calendar` → new `CalendarView.jsx`
  - `/stats` → new `StatsPage.jsx`
- Active route highlights the icon (same pattern as your `toggleBtnActive` styling)
- Nav sits fixed at the bottom of the viewport, always visible across pages

---

## 3. Data Model

### 3.1 Task object (extends what you already have)
```js
{
  id: string,
  title: string,
  description: string,
  source: 'canvas' | 'manual',       // where the task came from
  canvasDeadline: ISODateString | null,   // real due date from Canvas, if applicable
  adjustedDeadline: ISODateString,        // health-adjusted recommended completion date
  timeSlot: string,                       // e.g. "14:00–15:30" for today's schedule
  duration: number,                       // minutes
  cognitiveLoad: 'low' | 'medium' | 'deep' | 'rest',
  status: 'pending' | 'in_progress' | 'completed',
  completedAt: ISODateString | null,
  courseId: string | null,                // Canvas course reference
  createdAt: ISODateString
}
```

### 3.2 Health/wellness data (feeds the adjustment engine)
```js
{
  date: 'YYYY-MM-DD',
  sleepHours: number,
  sleepQuality: 1-5,          // self-reported or from wearable
  fatigueLevel: 1-5,          // self-reported
  concentrationScore: 1-5,    // self-reported or derived from completed focus sessions
  source: 'manual' | 'wearable' // future: Apple Health / Fitbit / Oura
}
```

### 3.3 Focus session log (for Stats page)
```js
{
  id: string,
  taskId: string,
  mode: 'pomodoro' | 'ultradian',
  plannedMinutes: number,
  actualMinutes: number,
  startedAt: ISODateString,
  endedAt: ISODateString,
  completed: boolean   // did they finish the block or bail early
}
```

---

## 4. Core Feature: Health-Aware Deadline Adjustment

This is the heart of the app. High-level logic (to refine into an actual algorithm/service later):

1. **Input**: Canvas deadline + assignment's estimated workload (duration/cognitive load) + recent health data (last 3–7 days of sleep, fatigue, concentration)
2. **Compute a "readiness score"** (0–100) from health data — you already have a `readinessScore` in your `Timeline` component, so this slots in directly
3. **Buffer calculation**: 
   - If readiness is low (poor sleep, high fatigue) → push the *recommended* start/completion date earlier, and spread deep-work tasks across more days
   - If readiness is high → student can work closer to the real deadline
   - Deep-work/high cognitive-load tasks get bigger buffers than low-load admin tasks
4. **Output**: `adjustedDeadline` is always ≤ `canvasDeadline`, never later. The real Canvas deadline is always shown too, so the student never loses track of the true due date — the app is a "coach," not a replacement source of truth.

This logic should live in its own service/module (e.g. `services/scheduleEngine.js`), separate from UI, so it can be unit-tested and tuned independently.

---

## 5. Canvas Integration

- Use Canvas's REST API (`/api/v1/courses/:id/assignments`) with a student-generated **Access Token** (simplest auth path for a personal/small-scale app — OAuth2 is the "real" path if this becomes multi-user/public)
- Sync job pulls: assignment name, due date, course, points possible (can be a rough proxy for workload/cognitive load)
- Store imported tasks with `source: 'canvas'` and `canvasDeadline` set; run them through the schedule engine to generate `adjustedDeadline`
- Re-sync periodically (e.g. on app load, or manual "Refresh from Canvas" button) — Canvas due dates can change

---

## 6. Timer (Pomodoro / Ultradian)

Your existing `FocusArena.jsx` already has the right shape. Additions to plan for:
- On timer completion, log a **focus session** (see 3.3) tied to the `activeTask`
- On session complete, prompt: "Mark task as done?" → updates task `status`
- Optionally auto-suggest break length (5 min after Pomodoro, 20 min after Ultradian)

---

## 7. Stats Page

- Total tasks completed (all-time, this week, today)
- Current streak (consecutive days with ≥1 completed task)
- Total focus minutes logged, broken down by Pomodoro vs. Ultradian
- Cognitive load breakdown (how much deep work vs. low-load work got done)
- Simple chart (bar or line) — can reuse a charting lib like `recharts`

---

## 8. Suggested Folder Structure

```
src/
  components/
    BottomNav.jsx / .module.css
    Timeline.jsx / .module.css        (existing — becomes To-Do page content)
    TaskForm.jsx / .module.css        (existing)
    FocusArena.jsx / .module.css      (existing — Timer page content)
    CalendarView.jsx / .module.css    (new)
    StatsPage.jsx / .module.css       (new)
  pages/
    TodoPage.jsx
    TimerPage.jsx
    CalendarPage.jsx
    StatsPage.jsx
  services/
    canvasApi.js         (fetch assignments from Canvas)
    scheduleEngine.js     (health-aware deadline adjustment logic)
    healthDataApi.js      (manual entry now, wearable integration later)
  store/
    useAppStore.js        (existing — extend with tasks, healthData, sessions)
  hooks/
    useTimer.js           (existing)
  App.jsx                 (router setup)
```

---

## 9. Backend Note

Your `TaskForm.jsx` currently POSTs to `http://localhost:8080/tasks` — looks like a local JSON server (e.g. `json-server`). For a real multi-page app with Canvas sync + health data, you'll want a slightly more structured backend eventually (endpoints for `/tasks`, `/health-data`, `/focus-sessions`, `/canvas/sync`), but `json-server` is fine to keep prototyping against for now.

---

## 10. Build Order (Recommended Phases)

1. **Routing + Bottom Nav** — wire up the 4 pages, move existing components into them, no new logic yet
2. **Stats page** — easiest new page, just reads focus session + task data
3. **Calendar page** — display existing task data in a month/week grid
4. **Health data input + schedule engine v1** — simple rule-based adjustment (not ML) to start
5. **Canvas API integration** — pull real deadlines, merge with manual tasks
6. **Polish** — animations, empty states, refine the adjustment algorithm with real usage data

---

## Open Questions for You
- Do you want Canvas auth via a personal access token (quick, per-student setup) or full OAuth (needed if this becomes a shared/public app)?
- For health data — manual daily check-in form, or do you want to hook up a wearable API (Apple Health, Fitbit, Oura) later?
- Should the Calendar page be read-only (view deadlines) or also let users drag tasks to reschedule?
