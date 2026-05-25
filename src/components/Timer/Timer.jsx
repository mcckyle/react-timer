//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 25 May 2026
//Description: This file contains the parent timer component for the timer React project.

import { useState, useEffect, useRef } from "react";
import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useCompletionSound } from "../../hooks/useCompletionSound";
import { useTheme } from "../../context/ThemeContext.jsx";

import TimerHeader from "../TimerHeader/TimerHeader.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import VisualTimer from "../VisualTimer/VisualTimer.jsx";
import TimerControls from "../TimerControls/TimerControls.jsx";
import "./Timer.css";

const Timer = ({ onToggleTheme }) =>
{
  const { duration, setDuration, timeLeft, setTimeLeft, running, start, pause, reset, pastTimers, clearPastTimers } = useTimer();
  const { theme } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState("digital"); //"digital" || "visual".

  const initialProgress = duration > 0 ? timeLeft / duration : 1;
  const [smoothProgress, setSmoothProgress] = useState(initialProgress);
  const [completed, setCompleted] = useState(false);

  const prevTimeRef = useRef(timeLeft);
  const progressRef = useRef(initialProgress);
  const rafRef = useRef(null);
  const resetDisabled = (timeLeft === DEFAULT_DURATION) && !running;

  //Continuous visual progress.
  const progress = Math.max(0, Math.min(1, smoothProgress));

  /* Dynamic ambient energy system.
     220 = cool blue, 160 = teal, 80 = lime, 18 = amber / red */
  const energy = Math.pow(1 - progress, 1.35);
  const hue = 220 - (198 * energy);
  const glow = 0.16 + (energy * 0.84);
  const depth = 1 + (energy * 0.06);

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
        "--ambient-energy": energy,
        "--ambient-hue": hue,
        "--ambient-glow": glow,
        "--ambient-depth": depth,
      }}
    >
      <TimerHeader
        theme={theme}
        onToggleTheme={onToggleTheme}
        duration={duration}
        onSelectDuration={handleSelectDuration}
        mode={mode}
        setMode={setMode}
        pastTimers={pastTimers}
        clearPastTimers={clearPastTimers}
        showHistory={showHistory}
        setShowHistory={setShowHistory}
      />

      <div className="stage">
        <section className="displayRegion" aria-label="Time remaining">
          {mode === "digital"
            ? <TimerDisplay timeLeft={timeLeft} />
            : <VisualTimer progress={progress} />
          }
          </section>
          <section className="controlsRegion" aria-label="Playback controls">
            <TimerControls
              running={running}
              onStart={start}
              onPause={pause}
              onReset={reset}
              resetDisabled={resetDisabled}
            />
          </section>
          <p className="timer-shortcuts">
            Space · Start / Pause · R · Reset · M · Mode
          </p>
        </div>
    </section>
  );
};

export default Timer;
