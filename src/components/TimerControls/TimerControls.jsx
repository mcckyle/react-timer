//File name: TimerControls.jsx
//Author: Kyle McColgan
//Date: 29 October 2026
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
  const primaryAction = running ? onPause : onStart;
  const primaryLabel = running ? "Pause" : "Start";

  return (
    <div
      className="timer-controls"
      role="group"
      aria-label="Timer controls"
    >
      <button
        type="button"
        className="timer-control timer-control-primary"
        onClick={primaryAction}
        aria-label={primaryLabel}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        className="timer-control timer-control-secondary"
        onClick={onReset}
        disabled={resetDisabled}
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  );
}
