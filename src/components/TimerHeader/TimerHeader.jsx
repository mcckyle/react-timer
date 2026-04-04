//File name: TimerHeader.jsx
//Author: Kyle McColgan
//Date: 3 April 2026
//Description: This file contains the timer header component for the timer React project.

import React from "react";
import DurationPicker from "../DurationPicker/DurationPicker.jsx";
import PastTimers from "../PastTimers/PastTimers.jsx";
import "./TimerHeader.css";

export default function TimerHeader({
    duration,
    onSelectDuration,
    mode,
    setMode,
    pastTimers,
    clearPastTimers,
    showHistory,
    setShowHistory,
}) {
    const hasHistory = pastTimers.length > 0;

    return (
        <header className="timer-header">
          {/* LEFT: Title. */}
          <div className="timer-header-left">
            <h1 className="timer-heading">Focus Timer</h1>
          </div>

          {/* CENTER: DurationPicker + ModeToggle. */}
          <div className="timer-header-center">
            <DurationPicker
            duration={duration}
            onSelect={onSelectDuration}
            />

            <div className="timer-mode-toggle">
              <button
                type="button"
                aria-pressed={mode === "digital"}
                onClick={() => setMode("digital")}
              >
                00:00
              </button>
              <button
                type="button"
                aria-pressed={mode === "visual"}
                onClick={() => setMode("visual")}
              >
                ◐
              </button>
            </div>
          </div>

          {/* RIGHT: History. */}
          <div className="timer-header-right">
          {hasHistory && (
            <>
              <button
                type="button"
                className="timer-history-button"
                onClick={() => setShowHistory((h) => !h)}
                aria-expanded={showHistory}
                aria-controls="timer-history"
              >
              {showHistory
                ? "Hide History"
                : `History (${pastTimers.length})`}
              </button>
              <div className={`timer-history${showHistory ? " is-visible" : ""}`}>
                <PastTimers timers={pastTimers} onClear={clearPastTimers} />
              </div>
            </>
          )}
        </div>
      </header>
    );
}
