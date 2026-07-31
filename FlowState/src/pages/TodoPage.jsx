import React, { useState } from "react";
import Timeline from "../components/Timeline";

const mockDailyPlan = {
  readinessScore: 84,
  schedule: [
    {
      id: 1,
      timeSlot: "09:00 AM",
      title: "Core Architecture Design",
      description: "Draft Spring Boot schema and workflow orchestration gates.",
      duration: 90,
      cognitiveLoad: "deep",
    },
    {
      id: 2,
      timeSlot: "10:30 AM",
      title: "Recovery Break",
      description: "Walk, hydrate, recharge.",
      duration: 20,
      cognitiveLoad: "rest",
    },
    {
      id: 3,
      timeSlot: "10:50 AM",
      title: "React UI Integration",
      description: "Wire Zustand store and routing.",
      duration: 90,
      cognitiveLoad: "deep",
    },
    {
      id: 4,
      timeSlot: "12:20 PM",
      title: "Inbox Review",
      description: "Low-load admin work.",
      duration: 30,
      cognitiveLoad: "low",
    },
  ],
};

export default function TodoPage() {
  const [, setRefresh] = useState(false);

  return (
    <Timeline
      dailyPlan={mockDailyPlan}
      onRefresh={() => setRefresh((prev) => !prev)}
    />
  );
}