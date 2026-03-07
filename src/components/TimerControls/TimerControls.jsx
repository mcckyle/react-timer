//File name: TimerControls.jsx
//Author: Kyle McColgan
//Date: 6 March 2026
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
  const primaryLabel = running ? "Pause" : "Start";
  const handlePrimary = running ? onPause : onStart;

  return (
    <div className="timer-controls" role="group" aria-label="Timer controls">
      <button
        type="button"
        className="timer-control is-primary"
        onClick={handlePrimary}
        aria-pressed={running}
      >
        {primaryLabel}
      </button>
      <button
        type="button"
        className="timer-control is-secondary"
        onClick={onReset}
        disabled={resetDisabled}
      >
        Reset
      </button>
    </div>
  );
}
