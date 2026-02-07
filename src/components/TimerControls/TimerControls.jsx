//File name: TimerControls.jsx
//Author: Kyle McColgan
//Date: 6 February 2026
//Description: This file contains the timer controls for the React timer project.

import "./TimerControls.css";

export default function TimerControls({
    running,
    onStart,
    onPause,
    onReset,
    resetDisabled,
})
{
    return (
        <div className="timer-controls">
          { ! running ? (
            <button className="timer-control primary" onClick={onStart}>
              Start
            </button>
          ) : (
            <button className="timer-control primary" onClick={onPause}>
              Pause
            </button>
        )}
          <button className="timer-control secondary" onClick={onReset} disabled={resetDisabled}>
            Reset
          </button>
        </div>
    );
}
