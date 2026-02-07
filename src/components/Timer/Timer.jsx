//File name: Timer.jsx
//Author: Kyle McColgan
//Date: 6 February 2026
//Description: This file contains the parent timer component for the React timer project.

import { useTimer, DEFAULT_DURATION } from "../../hooks/useTimer";
import DurationPicker from "../DurationPicker/DurationPicker.jsx";
import TimerDisplay from "../TimerDisplay/TimerDisplay.jsx";
import TimerControls from "../TimerControls/TimerControls.jsx";
import PastTimers from "../PastTimers/PastTimers.jsx";
import "./Timer.css";

export default function Timer()
{
  const { duration, setDuration, timeLeft, setTimeLeft, running, start, pause, reset, pastTimers, } = useTimer();
  const showDurationPicker = ! running;

  return (
      <section className="timer" aria-label="Timer">
        {showDurationPicker && (
          <header className="timer-header">
            <DurationPicker
              duration={duration}
              onSelect={value => {
                setDuration(value);
                setTimeLeft(value);
              }}
            />
          </header>
        )}

      <main className="timer-core">
        <TimerDisplay timeLeft={timeLeft} />
      </main>

      <nav className="timer-controls" aria-label="Timer controls">
        <TimerControls
          running={running}
          onStart={start}
          onPause={pause}
          onReset={reset}
          resetDisabled={timeLeft === DEFAULT_DURATION && ! running}
        />
      </nav>

      <footer className="timer-history">
        <PastTimers timers={pastTimers} />
      </footer>
    </section>
  );
};
