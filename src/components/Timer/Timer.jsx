//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 20 March 2026
//Description: This file contains the parent timer component for the timer React project.

import { useState } from "react";
import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import DurationPicker from "../DurationPicker/DurationPicker.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
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

  const handleSelectDuration = (value) =>
  {
    setDuration(value);
    setTimeLeft(value);
  };

  const toggleHistory = () =>
  {
    setShowHistory((prev) => !prev);
  };

  return (
    <section className="timer" aria-labelledby="timer-heading">
      <header className="timer-header">
        <h1 id="timer-heading" className="timer-heading">
          Focus Timer
        </h1>
      </header>

      {isIdle && (
        <DurationPicker
          duration={duration}
          onSelect={handleSelectDuration}
        />
      )}

      <div className="timer-core">
        <TimerDisplay timeLeft={timeLeft} />
        <TimerControls
          running={running}
          onStart={start}
          onPause={pause}
          onReset={reset}
          resetDisabled={resetDisabled}
          />
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

          {showHistory && (
            <section
              id="timer-history"
              className="timer-history"
              aria-label="Completed timers"
            >
              <PastTimers timers={pastTimers} onClear={clearPastTimers} />
            </section>
          )}
        </>
      )}
    </section>
  );
};
