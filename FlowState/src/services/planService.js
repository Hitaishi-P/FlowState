```javascript
// src/services/planService.js

import { getAllAssignments, normalizeCanvasAssignments } from "./canvasApi";
import { getReadiness } from "./healthDataApi";
import { buildSchedule } from "./scheduleEngine";
import { postDailyPlan } from "./dataApi";

/**
 * Generate today's Flowstate plan.
 *
 * This function coordinates the different services:
 *
 * Canvas → tasks
 * Health → readiness
 * Scheduler → plan
 * Data API → persistence
 */
export async function generateTodayPlan() {
  // 1. Get today's readiness.
  const readiness = await getReadiness();

  // 2. Get assignments from Canvas.
  const canvasAssignments = await getAllAssignments();

  // 3. Convert Canvas data into Flowstate's task format.
  const tasks = normalizeCanvasAssignments(canvasAssignments);

  // 4. Remove assignments that are already completed.
  const incompleteTasks = tasks.filter(
    (task) => !task.completed
  );

  // 5. Ask the scheduler what should be worked on.
  const scheduledTasks = buildSchedule({
    tasks: incompleteTasks,
    readinessScore: readiness.score,
  });

  // 6. Create today's plan.
  const today = new Date().toISOString().slice(0, 10);

  const plan = {
    date: today,
    readinessScore: readiness.score,
    schedule: scheduledTasks,
  };

  // 7. Save the plan.
  const savedPlan = await postDailyPlan(plan);

  // 8. Return it to whoever called this function.
  return savedPlan;
}
```
