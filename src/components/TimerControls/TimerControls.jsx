//File name: TimerControls.jsx
//Author: Kyle McColgan
//Date: 13 April 2026
//Description: This file contains the timer controls for the timer React project.

import "./TimerControls.css";

export default function TimerControls({
    running,
    onStart,
    onPause,
    onReset,
    resetDisabled,
})
{
  const isRunning = running;
  const primaryAction = isRunning ? onPause : onStart;
  const primaryLabel = isRunning ? "Pause" : "Start";

  return (
    <section
      className="timer-controls"
      role="group"
      aria-label="Timer controls"
    >
      <button
        type="button"
        className="timer-control is-primary"
        onClick={primaryAction}
        aria-pressed={isRunning}
        aria-label={primaryLabel}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        className="timer-control is-secondary"
        onClick={onReset}
        disabled={resetDisabled}
        aria-label="Reset timer"
      >
        Reset
      </button>
    </section>
  );
}
