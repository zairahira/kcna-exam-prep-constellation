"use client";

import { useTimer } from "@/lib/timer-context";

export default function PomodoroTimer() {
  const { secondsLeft, isActive, isBreak, isEnabled, start, pause, reset } = useTimer();

  if (!isEnabled) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const displayTime = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className="flex flex-col gap-2 mt-4 p-3 bg-surface/50 border border-surface-border rounded-md mono">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted uppercase tracking-widest">
          {isBreak ? "Break Session" : "Focus Session"}
        </span>
        <span className={`text-sm font-bold ${isBreak ? "text-success" : "text-warning"}`}>
          {displayTime}
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        {isActive ? (
          <button 
            onClick={pause}
            className="text-[10px] px-2 py-1 bg-surface-border hover:bg-muted transition rounded flex-1 uppercase"
          >
            Pause
          </button>
        ) : (
          <button 
            onClick={start}
            className="text-[10px] px-2 py-1 bg-warning text-bg font-bold hover:opacity-80 transition rounded flex-1 uppercase"
          >
            Focus
          </button>
        )}
        <button 
          onClick={reset}
          className="text-[10px] px-2 py-1 border border-surface-border hover:border-danger hover:text-danger transition rounded uppercase"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
