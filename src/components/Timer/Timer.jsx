//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 14 February 2026
//Description: This file contains the parent timer component for the React timer project.

import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import DurationPicker from "../DurationPicker/DurationPicker.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import TimerControls from "../TimerControls/TimerControls.jsx";
import PastTimers from "../PastTimers/PastTimers.jsx";
import "./Timer.css";

export default function Timer()
{
  const { duration, setDuration, timeLeft, setTimeLeft, running, start, pause, reset, pastTimers, clearPastTimers } = useTimer();
  const showDurationPicker = ! running;

  const handleSelectDuration = (value) => {
    setDuration(value);
    setTimeLeft(value);
  };

  return (
      <section className="timer" aria-label="Focus timer">
        {showDurationPicker && (
          <header className="timer-header">
            <DurationPicker
              duration={duration}
              onSelect={handleSelectDuration}
            />
          </header>
        )}

        <div className="timer-main">
          <TimerDisplay timeLeft={timeLeft} />
          <TimerControls
            running={running}
            onStart={start}
            onPause={pause}
            onReset={reset}
            resetDisabled={timeLeft === DEFAULT_DURATION && ! running}
            />
        </div>

        {pastTimers.length > 0 && (
          <footer className="timer-history">
            <PastTimers timers={pastTimers} onClear={clearPastTimers} />
          </footer>
        )}
      </section>
  );
};
