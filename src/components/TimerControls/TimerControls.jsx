//File name: TimerControls.jsx
//Author: Kyle McColgan
//Date: 13 March 2026
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
    <section
      className="timer-controls"
      role="group"
      aria-label="Timer controls"
    >
      <button
        type="button"
        className="timer-control is-primary"
        onClick={primaryAction}
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
    </section>
  );
}
