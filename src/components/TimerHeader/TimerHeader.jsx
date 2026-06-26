//File name: TimerHeader.jsx
//Author: Kyle McColgan
//Date: 16 June 2026
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
  const nextThemeLabel = isDark ? "light" : "dark";

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
          className="timer-header-mode"
          role="group"
          aria-label="Display mode"
        >
          <button
            type="button"
            aria-pressed={mode === "digital"}
            aria-label="Digital mode"
            onClick={() => setMode("digital")}
          >
            00:00
          </button>
          <button
            type="button"
            aria-pressed={mode === "visual"}
            aria-label="Visual mode"
            onClick={() => setMode("visual")}
          >
            ◐
          </button>
        </div>
      </div>

      {/* RIGHT: History. */}
      <div className="timer-header-right">
        <div className="timer-header-actions">
          {hasHistory && (
            <div className="timer-header-history">
              <button
                type="button"
                className="timer-header-history-button"
                onClick={() => setShowHistory((h) => !h)}
                aria-expanded={showHistory}
                aria-controls="timer-history"
              >
                <span className="timer-header-history-label">
                  History
                </span>
                <span className="timer-header-history-meta">
                  {showHistory ? "Close" : pastTimers.length}
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
            className="toggle"
            onClick={toggleTheme}
            aria-pressed={isDark}
            aria-label={`Activate ${nextThemeLabel} theme`}
            title={`Activate ${nextThemeLabel} theme`}
          >
            {isDark ? (
              <Sun className="toggleIcon" aria-hidden="true" />
            ) : (
              <Moon className="toggleIcon" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
