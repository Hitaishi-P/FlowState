```javascript
// src/services/scheduleEngine.js

const LOAD_ORDER = {
  deep: 4,
  medium: 3,
  low: 2,
  rest: 1,
};

const READINESS_RULES = [
  {
    min: 80,
    allowedLoads: ["deep", "medium", "low", "rest"],
    maxDeepMinutes: 180,
  },
  {
    min: 60,
    allowedLoads: ["medium", "low", "rest"],
    maxDeepMinutes: 90,
  },
  {
    min: 0,
    allowedLoads: ["low", "rest"],
    maxDeepMinutes: 0,
  },
];

function getReadinessRule(readinessScore = 0) {
  return (
    READINESS_RULES.find((rule) => readinessScore >= rule.min) ||
    READINESS_RULES[READINESS_RULES.length - 1]
  );
}

/**
 * Sort tasks so higher cognitive-load tasks are considered first.
 * Within the same load, preserve the original order.
 */
function sortByCognitiveLoad(tasks) {
  return [...tasks].sort(
    (a, b) =>
      (LOAD_ORDER[b.cognitiveLoad] || 0) -
      (LOAD_ORDER[a.cognitiveLoad] || 0)
  );
}

/**
 * Returns true if a task is compatible with the user's readiness.
 */
export function isTaskAllowed(task, readinessScore) {
  const rule = getReadinessRule(readinessScore);
  return rule.allowedLoads.includes(task.cognitiveLoad);
}

/**
 * Calculate how many minutes of deep work are already scheduled.
 */
export function getDeepWorkMinutes(tasks = []) {
  return tasks
    .filter((task) => task.cognitiveLoad === "deep")
    .reduce((sum, task) => sum + (Number(task.duration) || 0), 0);
}

/**
 * Creates a cognitive-load-aware schedule.
 *
 * This does not modify the original task array.
 *
 * @param {Object} options
 * @param {Array} options.tasks
 * @param {number} options.readinessScore
 * @returns {Array} scheduled tasks
 */
export function buildSchedule({
  tasks = [],
  readinessScore = 0,
} = {}) {
  const rule = getReadinessRule(readinessScore);
  const sortedTasks = sortByCognitiveLoad(tasks);

  let deepMinutes = 0;

  return sortedTasks
    .filter((task) => isTaskAllowed(task, readinessScore))
    .map((task) => {
      const duration = Number(task.duration) || 0;

      if (task.cognitiveLoad === "deep") {
        if (deepMinutes >= rule.maxDeepMinutes) {
          return null;
        }

        const remainingDeepMinutes = rule.maxDeepMinutes - deepMinutes;

        if (duration > remainingDeepMinutes) {
          return {
            ...task,
            duration: remainingDeepMinutes,
          };
        }

        deepMinutes += duration;
      }

      return {
        ...task,
        duration,
      };
    })
    .filter(Boolean);
}

/**
 * Summarize the cognitive load of a schedule.
 */
export function summarizeLoad(tasks = []) {
  return tasks.reduce(
    (summary, task) => {
      const load = task.cognitiveLoad;

      if (summary[load] !== undefined) {
        summary[load] += Number(task.duration) || 0;
      }

      summary.totalMinutes += Number(task.duration) || 0;

      return summary;
    },
    {
      deep: 0,
      medium: 0,
      low: 0,
      rest: 0,
      totalMinutes: 0,
    }
  );
}

/**
 * Generate a simple readiness summary for the UI.
 */
export function getReadinessSummary(readinessScore = 0) {
  if (readinessScore >= 80) {
    return {
      level: "high",
      label: "High readiness",
      message: "Good conditions for deep, demanding work.",
    };
  }

  if (readinessScore >= 60) {
    return {
      level: "moderate",
      label: "Moderate readiness",
      message: "Balance focused work with lighter tasks and recovery.",
    };
  }

  return {
    level: "low",
    label: "Low readiness",
    message: "Prioritize lighter work and recovery today.",
  };
}
```
