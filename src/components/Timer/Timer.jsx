//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 9 April 2026
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
  const resetDisabled = timeLeft === DEFAULT_DURATION && !running;

  //Ambient progress (0 -> 1).
  const progress = smoothProgress;

  /* Map progress -> hue (cool -> warm).
     220 = blue, 140 = green, 20 = orange/red */
  const hue = 220 - (200 * Math.pow(1 - progress, 1.15));

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
      const deltaProgress = delta / duration;

      progressRef.current = Math.max(0, progressRef.current - deltaProgress);
      setSmoothProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => (rafRef.current) && (cancelAnimationFrame(rafRef.current));
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

      <div className="timer-core">
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
            Space · Start / Pause · R · Reset
          </p>
        </div>
    </section>
  );
};
