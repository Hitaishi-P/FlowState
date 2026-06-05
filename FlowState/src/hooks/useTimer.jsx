import { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';

export function useTimer(initialMinutes = 90) {
  const { isTimerRunning, setTimerRunning } = useAppStore();
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const endTimeRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isTimerRunning) {
      // Set the absolute future timestamp when the timer should end
      endTimeRef.current = Date.now() + timeLeft * 1000;

      intervalRef.current = setInterval(() => {
        const remaining = Math.round((endTimeRef.current - Date.now()) / 1000);
        
        if (remaining <= 0) {
          clearInterval(intervalRef.current);
          setTimeLeft(0);
          setTimerRunning(false);
          // Trigger push notification or alert here
          alert("Focus session complete! Take a recovery break.");
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTimerRunning, setTimerRunning]);

  const startTimer = () => setTimerRunning(true);
  const pauseTimer = () => setTimerRunning(false);
  const resetTimer = (minutes = initialMinutes) => {
    setTimerRunning(false);
    setTimeLeft(minutes * 60);
  };

  const formatTime = () => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return { timeLeft, startTimer, pauseTimer, resetTimer, formatTime };
}