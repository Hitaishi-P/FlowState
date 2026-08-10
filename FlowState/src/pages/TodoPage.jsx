```jsx
import React, { useEffect, useState } from "react";
import Timeline from "../components/Timeline";
import { getDailyPlans } from "../services/dataApi";

export default function TodoPage() {
  const [dailyPlan, setDailyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTodayPlan = async () => {
    try {
      setLoading(true);
      setError(null);

      const plans = await getDailyPlans();

      // Get today's date in YYYY-MM-DD format.
      const today = new Date().toISOString().slice(0, 10);

      const todayPlan = plans.find(
        (plan) => plan.date === today
      );

      setDailyPlan(todayPlan || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodayPlan();
  }, []);

  if (loading) {
    return <div>Loading today's plan...</div>;
  }

  if (error) {
    return <div>Couldn't load today's plan: {error}</div>;
  }

  if (!dailyPlan) {
    return <div>No plan scheduled for today.</div>;
  }

  return (
    <Timeline
      dailyPlan={dailyPlan}
      onRefresh={loadTodayPlan}
    />
  );
}
```
