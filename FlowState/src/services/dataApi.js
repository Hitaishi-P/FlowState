// src/services/dataApi.js
const API_BASE_URL = "http://localhost:3001"; // json-server default — update if different

async function request(path) {
  const res = await fetch(`${API_BASE_URL}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export function getDailyPlans() {
  return request("daily_plans");
}

export function getSessions() {
  return request("sessions");
}

export function getTasks() {
  return request("tasks");
}

export async function postSession(session) {
  const res = await fetch(`${API_BASE_URL}/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
  if (!res.ok) throw new Error(`Failed to save session: ${res.status}`);
  return res.json();
}