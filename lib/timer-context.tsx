"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

interface TimerContextType {
  secondsLeft: number;
  isActive: boolean;
  isBreak: boolean;
  isEnabled: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  toggleEnabled: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [secondsLeft, setSecondsLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const savedEnabled = localStorage.getItem("kcna-timer-enabled");
    if (savedEnabled === "true") setIsEnabled(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("kcna-timer-enabled", String(isEnabled));
  }, [isEnabled]);

  const start = useCallback(() => setIsActive(true), []);
  const pause = useCallback(() => setIsActive(false), []);
  
  const reset = useCallback(() => {
    setIsActive(false);
    setIsBreak(false);
    setSecondsLeft(WORK_TIME);
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && secondsLeft === 0) {
      // Toggle session
      if (!isBreak) {
        setIsBreak(true);
        setSecondsLeft(BREAK_TIME);
      } else {
        setIsBreak(false);
        setSecondsLeft(WORK_TIME);
      }
      
      // Simple alert or feedback could go here
      if (typeof window !== "undefined") {
        const audio = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
        audio.play().catch(() => {}); // Browser might block auto-play
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, isBreak]);

  return (
    <TimerContext.Provider value={{
      secondsLeft,
      isActive,
      isBreak,
      isEnabled,
      start,
      pause,
      reset,
      toggleEnabled
    }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
