//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 3 April 2026
//Description: This file contains the parent timer component for the timer React project.

import { useState, useEffect, useRef } from "react";
import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useCompletionSound } from "../../hooks/useCompletionSound";

import TimerHeader from "../TimerHeader/TimerHeader.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import VisualTimer from "../VisualTimer/VisualTimer.jsx";
import TimerControls from "../TimerControls/TimerControls.jsx";
import "./Timer.css";

export default function Timer()
{
  const { duration, setDuration, timeLeft, setTimeLeft, running, start, pause, reset, pastTimers, clearPastTimers } = useTimer();
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState("digital"); //"digital" || "visual".
  const [smoothProgress, setSmoothProgress] = useState(1);
  const [completed, setCompleted] = useState(false);

  const prevTimeRef = useRef(timeLeft);
  const progressRef = useRef(1);
  const rafRef = useRef(null);
  const isIdle = !running;
  const hasHistory = pastTimers.length > 0;
  const resetDisabled = timeLeft === DEFAULT_DURATION && !running;

  //Ambient progress (0 -> 1).
  const progress = smoothProgress;

  /* Map progress -> hue (cool -> warm).
     220 = blue, 140 = green, 20 = orange/red */
  const hue = 220 - (200 * (1 - progress));

  //Smooth visual progress loop (independent of state updates).
  useEffect(() => {
    if (!running)
    {
      progressRef.current = timeLeft / duration;
      setSmoothProgress(progressRef.current);
      return;
    }

    let lastTime = Date.now();

    const tick = () =>
    {
      const now = Date.now();
      const delta = now - lastTime;
      lastTime = now;

      //Reduce progress continuously.
      const deltaProgress = delta / duration;

      progressRef.current = Math.max(0, progressRef.current - deltaProgress);
      setSmoothProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () =>
    {
      if (rafRef.current)
      {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [running, duration, timeLeft]);

  //Detect completion moment (edge trigger).
  useEffect(() => {
    if ( (prevTimeRef.current > 0) && (timeLeft === 0))
    {
      setCompleted(true);

      //Auto-clear after animation window.
      const timeout = setTimeout(() => setCompleted(false), 900);
      return () => clearTimeout(timeout);
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft]);

  const handleSelectDuration = (value) =>
  {
    setDuration(value);
    setTimeLeft(value);
  };

  useKeyboardShortcuts({
    running,
    onStart: start,
    onPause: pause,
    onReset: reset,
    onToggleMode: () =>
      setMode((m) => (m === "digital" ? "visual" : "digital")),
    onToggleHistory: () =>
      setShowHistory((h) => !h),
  });

  useCompletionSound(completed);

  return (
    <section
      className={`timer${completed ? " is-complete" : ""}${running ? " is-running" : ""}`}
      aria-labelledby="timer-heading"
      style={{
        "--ambient-progress": progress,
        "--ambient-hue": hue,
      }}
    >
      <TimerHeader
        duration={duration}
        onSelectDuration={handleSelectDuration}
        mode={mode}
        setMode={setMode}
        pastTimers={pastTimers}
        clearPastTimers={clearPastTimers}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />

      <main className="timer-container" aria-label="Timer">
        <section className="timer-core" aria-label="Time remaining and controls">
          {mode === "digital"
            ? <TimerDisplay timeLeft={timeLeft} />
            : <VisualTimer progress={progress} />
          }
          <TimerControls
            running={running}
            onStart={start}
            onPause={pause}
            onReset={reset}
            resetDisabled={resetDisabled}
          />
          <p className="timer-shortcuts">
            Space • Start / Pause · R • Reset
          </p>
        </section>
      </main>
    </section>
  );
};
