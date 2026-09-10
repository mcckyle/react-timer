//File name: TimerHeader.jsx
//Author: Kyle McColgan
//Date: 9 September 2026
//Description: This file contains the timer header component for the timer React project.

import React from "react";
import { Clock, Sun, Moon } from "lucide-react";
import DurationPicker from "../DurationPicker/DurationPicker.jsx";
import PastTimers from "../PastTimers/PastTimers.jsx";
import "./TimerHeader.css";

export default function TimerHeader({
  theme,
  toggleTheme,
  duration,
  onSelectDuration,
  mode,
  setMode,
  pastTimers,
  clearPastTimers,
  showHistory,
  setShowHistory,
})
{
  const hasHistory = pastTimers.length > 0;
  const isDark = theme === "dark";

  return (
    <header className="timer-header">
      {/* LEFT: Title. */}
      <div className="timer-header-left">
        <h1 className="timer-header-title">Focus Timer</h1>
      </div>

      {/* CENTER: DurationPicker + ModeToggle. */}
      <div className="timer-header-center">
        <DurationPicker duration={duration} onSelect={onSelectDuration} />
        <div
          className="timer-header-mode timer-glass"
          role="group"
          aria-label="Display mode"
        >
          <button
            type="button"
            aria-label="Digital timer"
            aria-pressed={mode === "digital"}
            onClick={() => setMode("digital")}
          >
            <span aria-hidden="true">00:00</span>
          </button>
          <button
            type="button"
            aria-label="Visual timer"
            aria-pressed={mode === "visual"}
            onClick={() => setMode("visual")}
          >
            <span aria-hidden="true">◐</span>
          </button>
        </div>
      </div>

      {/* RIGHT: History. */}
      <div className="timer-header-right">
        {hasHistory && (
          <div className="timer-header-history">
            <button
              type="button"
              className="timer-header-history-button timer-glass"
              onClick={() => setShowHistory((visible) => !visible)}
              aria-expanded={showHistory}
              aria-controls="timer-history"
            >
              <span>History</span>
              <span
                className="timer-header-history-count"
                aria-hidden="true"
              >
                {showHistory ? "×" : pastTimers.length}
              </span>
            </button>
            <div
              id="timer-history"
              className={`timer-header-history-panel${showHistory ? " is-visible" : ""}`}
            >
              <PastTimers timers={pastTimers} onClear={clearPastTimers} />
            </div>
          </div>
        )}
        <button
          type="button"
          className="timer-theme-toggle timer-glass"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
          aria-pressed={isDark}
        >
          {isDark ? (
            <Sun className="toggleIcon" aria-hidden="true" />
          ) : (
            <Moon className="toggleIcon" aria-hidden="true" />
          )}
        </button>
      </div>
    </header>
  );
}
