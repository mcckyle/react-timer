//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 4 May 2026
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

  //Continuous visual progress.
  const progress = smoothProgress;

  /* Dynamic ambient hue.
     220 = cool blue, 140 = green, 18 = warm amber / red */
  const hue = 220 - (202 * Math.pow(1 - progress, 1.32));

  //Ambient intensity response;
  const ambientStrength = Math.pow(1 - progress, 1.4);

  //Smooth independent progress loop.
  useEffect(() => {
    if (!running)
    {
      progressRef.current = timeLeft / duration;
      setSmoothProgress(progressRef.current);
      return;
    }

    let lastTime = performance.now();

    const tick = () =>
    {
      const now = performance.now();
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
    if ((prevTimeRef.current > 0) && (timeLeft === 0))
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

  useKeyboardShortcuts({
    running,
    onStart: start,
    onPause: pause,
    onReset: reset,
    onToggleMode: () =>
      setMode((current) => (current === "digital" ? "visual" : "digital")),
    onToggleHistory: () =>
      setShowHistory((current) => !current),
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
