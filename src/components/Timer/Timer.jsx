//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 26 March 2026
//Description: This file contains the parent timer component for the timer React project.

import { useState, useEffect, useRef } from "react";
import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useCompletionSound } from "../../hooks/useCompletionSound";

import DurationPicker from "../DurationPicker/DurationPicker.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import VisualTimer from "../VisualTimer/VisualTimer.jsx";
import TimerControls from "../TimerControls/TimerControls.jsx";
import PastTimers from "../PastTimers/PastTimers.jsx";
import "./Timer.css";

export default function Timer()
{
  const { duration, setDuration, timeLeft, setTimeLeft, running, start, pause, reset, pastTimers, clearPastTimers } = useTimer();
  const [showHistory, setShowHistory] = useState(false);
  const isIdle = !running;
  const hasHistory = pastTimers.length > 0;
  const resetDisabled = timeLeft === DEFAULT_DURATION && !running;

  //Ambient progress (0 -> 1).
  const progress = duration > 0 ? timeLeft / duration : 0;

  /* Map progress -> hue (cool -> warm).
     220 = blue, 140 = green, 20 = orange/red */
  const hue = 220 - (200 * (1 - progress));

  //Completion moment.
  const [completed, setCompleted] = useState(false);
  const prevTimeRef = useRef(timeLeft);

  //Visual Timer Modes.
  const [mode, setMode] = useState("digital"); //"digital" || "visual".

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

  const toggleHistory = () =>
  {
    setShowHistory((prev) => !prev);
  };

  const toggleMode = () =>
  {
    setMode((prev) => (prev === "digital" ? "visual" : "digital"));
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
      className={`timer${completed ? " is-complete" : ""}`}
      aria-labelledby="timer-heading"
      style={{
        "--ambient-progress": progress,
        "--ambient-hue": hue,
      }}
    >
      <header className="timer-header">
        <h1 id="timer-heading" className="timer-heading">
          Focus Timer
        </h1>
      </header>

      <div className="timer-mode-toggle">
        <button
          type="button"
          onClick={() => setMode("digital")}
          aria-pressed={mode === "digital"}
        >
          00:00
        </button>
        <button
          type="button"
          onClick={() => setMode("visual")}
          aria-pressed={mode === "visual"}
        >
          ◐
        </button>
      </div>

      <div className={`timer-duration-slot${isIdle ? " is-visible" : ""}`}>
        <DurationPicker
          duration={duration}
          onSelect={handleSelectDuration}
        />
      </div>

      <div className="timer-core">
        {mode === "digital" ? (
          <TimerDisplay timeLeft={timeLeft} />
        ) : (
          <VisualTimer progress={progress} />
        )}

        <TimerControls
          running={running}
          onStart={start}
          onPause={pause}
          onReset={reset}
          resetDisabled={resetDisabled}
        />
        <p className="timer-shortcuts">
          Space • Start / Pause &nbsp; · &nbsp; R • Reset
        </p>
      </div>

      {hasHistory && (
        <>
          <div className="timer-history-toggle">
            <button
              type="button"
              className="timer-history-button"
              onClick={toggleHistory}
              aria-expanded={showHistory}
              aria-controls="timer-history"
            >
              {showHistory
                ? "Hide History"
                : `Show History (${pastTimers.length})`}
            </button>
          </div>

          <section
            id="timer-history"
            className={`timer-history${showHistory ? " is-visible" : ""}`}
            aria-hidden={!showHistory}
          >
            <PastTimers timers={pastTimers} onClear={clearPastTimers} />
          </section>
        </>
      )}
    </section>
  );
};
