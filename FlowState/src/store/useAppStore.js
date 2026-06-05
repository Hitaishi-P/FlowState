import { create } from 'zustand';

export const useAppStore = create((set) => ({
  activeTask: null,
  isTimerRunning: false,
  timerMode: 'ultradian', // 'pomodoro' or 'ultradian'
  setActiveTask: (task) => set({ activeTask: task }),
  setTimerRunning: (isRunning) => set({ isTimerRunning: isRunning }),
  setTimerMode: (mode) => set({ timerMode: mode }),
}));