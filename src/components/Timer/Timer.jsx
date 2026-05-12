//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 11 May 2026
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
  const resetDisabled = (timeLeft === DEFAULT_DURATION) && !running;

  //Continuous visual progress.
  const progress = Math.max(0, Math.min(1, smoothProgress));

  /* Dynamic ambient hue system.
     220 = cool blue, 140 = green, 18 = warm amber / red */
  const ambientStrength = Math.pow(1 - progress, 1.25);
  const hue = 220 - (202 * ambientStrength);

  //RAF-driven visual smoothing.
  useEffect(() =>
  {
    if (!running)
    {
      const staticProgress = timeLeft / duration;
      progressRef.current = staticProgress;
      setSmoothProgress(staticProgress);
      return;
    }

    let previousFrame = performance.now();

    const animate = () =>
    {
      const now = performance.now();
      const delta = now - previousFrame;
      previousFrame = now;

      progressRef.current = Math.max(0, progressRef.current - (delta / duration));
      setSmoothProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () =>
    {
      if (rafRef.current)
      {
        cancelAnimationFrame(rafRef.current);
      }
    }
  }, [running, duration, timeLeft]);

  //Completion Detection.
  useEffect(() =>
  {
    const completedNow = (prevTimeRef.current > 0) && (timeLeft === 0);
    if (completedNow)
    {
      setCompleted(true);

      //Auto-clear after animation window.
      const timeout = setTimeout(() => setCompleted(false), 1100);
      return () => clearTimeout(timeout);
    }
    prevTimeRef.current = timeLeft;
  }, [timeLeft]);

  const handleSelectDuration = (value) =>
  {
    setDuration(value);
    setTimeLeft(value);
  };

  const toggleMode = () =>
  {
    setMode((current) => current === "digital" ? "visual" : "digital");
  };

  const toggleHistory = () =>
  {
    setShowHistory((current) => !current);
  };

  useKeyboardShortcuts({
    running,
    onStart: start,
    onPause: pause,
    onReset: reset,
    onToggleMode: toggleMode,
    onToggleHistory: toggleHistory,
  });

  useCompletionSound(completed);

  return (
    <section
      className={`timer${completed ? " is-complete" : ""}${running ? " is-running" : ""}`}
      style={{
        "--ambient-progress": progress,
        "--ambient-strength": ambientStrength,
        "--ambient-hue": hue,
      }}
    >
      <div className="timer-ambient-grid" aria-hidden="true" />
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
          Space · Start / Pause · R · Reset · M · Mode
        </p>
      </div>
    </section>
  );
};
