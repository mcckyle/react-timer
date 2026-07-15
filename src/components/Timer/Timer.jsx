//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 15 July 2026
//Description: This file contains the parent timer component for the timer React project.

import { useState, useEffect, useRef } from "react";
import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import { useAmbientEngine } from "../../hooks/useAmbientEngine";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useCompletionSound } from "../../hooks/useCompletionSound";
import { useTheme } from "../../context/ThemeContext.jsx";

import TimerHeader from "../TimerHeader/TimerHeader.jsx";
import AmbientBackground from "../AmbientBackground/AmbientBackground.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import VisualTimer from "../VisualTimer/VisualTimer.jsx";
import TimerControls from "../TimerControls/TimerControls.jsx";
import "./Timer.css";

const Timer = ({ toggleTheme }) =>
{
  const { duration, setDuration, timeLeft, setTimeLeft, running, start, pause, reset, pastTimers, clearPastTimers } = useTimer();
  const { theme } = useTheme();
  const [showHistory, setShowHistory] = useState(false);
  const [mode, setMode] = useState("digital"); //"digital" || "visual".
  const [completed, setCompleted] = useState(false);

  const prevTimeRef = useRef(timeLeft);
  const resetDisabled = (timeLeft === DEFAULT_DURATION) && !running;
  const ambient = useAmbientEngine({ duration, timeLeft, running });

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
      style={ambient.style}
    >
      <AmbientBackground />
      <TimerHeader
        theme={theme}
        toggleTheme={toggleTheme}
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
            : <VisualTimer progress={ambient.progress} />
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
