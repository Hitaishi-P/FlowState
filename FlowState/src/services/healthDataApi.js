```javascript
// src/services/healthDataApi.js

/**
 * Flowstate health/readiness data adapter.
 *
 * This file intentionally does NOT connect directly to Apple Health,
 * Google Health Connect, Fitbit, Garmin, etc. Browser-based React apps
 * generally need a native app or backend integration for those platforms.
 *
 * Instead, the rest of Flowstate talks to this normalized interface.
 */

const DEFAULT_READINESS = {
  score: 84,
  sleepHours: 7.5,
  sleepQuality: "good",
  recoveryScore: 82,
  restingHeartRate: null,
  hrv: null,
  source: "mock",
};

/**
 * Return the latest readiness data.
 *
 * Currently returns mock data.
 * Replace the implementation later with a real provider.
 */
export async function getReadiness() {
  return {
    ...DEFAULT_READINESS,
    measuredAt: new Date().toISOString(),
  };
}

/**
 * Return health data for a particular date.
 *
 * Date should be YYYY-MM-DD.
 */
export async function getReadinessForDate(date) {
  // Placeholder until a real health provider is connected.
  return {
    ...DEFAULT_READINESS,
    date,
    measuredAt: `${date}T08:00:00`,
  };
}

/**
 * Convert raw health metrics into Flowstate's 0–100 readiness score.
 *
 * Each metric is optional. Missing metrics simply don't contribute.
 */
export function calculateReadinessScore({
  sleepHours,
  sleepQuality,
  recoveryScore,
  restingHeartRate,
  baselineRestingHeartRate,
  hrv,
  baselineHrv,
} = {}) {
  const scores = [];
  const weights = [];

  // Sleep duration
  if (typeof sleepHours === "number") {
    let sleepScore;

    if (sleepHours >= 7 && sleepHours <= 9) {
      sleepScore = 100;
    } else if (sleepHours >= 6) {
      sleepScore = 80;
    } else if (sleepHours >= 5) {
      sleepScore = 60;
    } else {
      sleepScore = 40;
    }

    scores.push(sleepScore);
    weights.push(0.35);
  }

  // Sleep quality
  if (sleepQuality) {
    const qualityScores = {
      excellent: 100,
      good: 85,
      fair: 65,
      poor: 40,
    };

    if (qualityScores[sleepQuality] !== undefined) {
      scores.push(qualityScores[sleepQuality]);
      weights.push(0.15);
    }
  }

  // Provider recovery score
  if (typeof recoveryScore === "number") {
    scores.push(clamp(recoveryScore, 0, 100));
    weights.push(0.3);
  }

  // Resting heart rate relative to personal baseline
  if (
    typeof restingHeartRate === "number" &&
    typeof baselineRestingHeartRate === "number" &&
    baselineRestingHeartRate > 0
  ) {
    const difference =
      restingHeartRate - baselineRestingHeartRate;

    let heartRateScore;

    if (difference <= 0) {
      heartRateScore = 100;
    } else if (difference <= 3) {
      heartRateScore = 90;
    } else if (difference <= 6) {
      heartRateScore = 75;
    } else if (difference <= 10) {
      heartRateScore = 55;
    } else {
      heartRateScore = 35;
    }

    scores.push(heartRateScore);
    weights.push(0.1);
  }

  // HRV relative to personal baseline
  if (
    typeof hrv === "number" &&
    typeof baselineHrv === "number" &&
    baselineHrv > 0
  ) {
    const ratio = hrv / baselineHrv;

    let hrvScore;

    if (ratio >= 1) {
      hrvScore = 100;
    } else if (ratio >= 0.9) {
      hrvScore = 90;
    } else if (ratio >= 0.8) {
      hrvScore = 75;
    } else if (ratio >= 0.7) {
      hrvScore = 60;
    } else {
      hrvScore = 40;
    }

    scores.push(hrvScore);
    weights.push(0.1);
  }

  if (scores.length === 0) {
    return null;
  }

  /*
   * Normalize the weights because some metrics may be unavailable.
   */
  const totalWeight = weights.reduce(
    (sum, weight) => sum + weight,
    0
  );

  const weightedScore = scores.reduce(
    (sum, score, index) =>
      sum + score * weights[index],
    0
  );

  return Math.round(weightedScore / totalWeight);
}

/**
 * Convert a readiness score into a category useful to the UI.
 */
export function getReadinessLevel(score) {
  if (score >= 80) {
    return "high";
  }

  if (score >= 60) {
    return "moderate";
  }

  if (score >= 40) {
    return "low";
  }

  return "very-low";
}

/**
 * Convert readiness into a simple scheduling recommendation.
 */
export function getReadinessRecommendation(score) {
  if (score >= 80) {
    return {
      level: "high",
      label: "Ready for deep work",
      description:
        "Good conditions for demanding cognitive work.",
    };
  }

  if (score >= 60) {
    return {
      level: "moderate",
      label: "Balance your workload",
      description:
        "Use focused blocks, but mix in lighter work and recovery.",
    };
  }

  if (score >= 40) {
    return {
      level: "low",
      label: "Protect your energy",
      description:
        "Prioritize lighter tasks and shorter focus blocks.",
    };
  }

  return {
    level: "very-low",
    label: "Recovery day",
    description:
      "Favor recovery and low-demand tasks today.",
  };
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
```
