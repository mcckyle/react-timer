//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 25 August 2026
//Description: This file contains the time display for the timer React project.

import { formatDuration } from "../../utils/formatDuration";
import AnimatedDigit from "../AnimatedDigit/AnimatedDigit.jsx";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
  //Only update visible digits once per second.
  const seconds = Math.max(0, Math.ceil(timeLeft / 1000));
  const display = formatDuration(seconds * 1000);
  const characters = [...display];

  return (
    <time
      className="timer-display"
      role="timer"
      aria-live="off"
      aria-atomic="true"
      aria-label={`${display} remaining`}
      dateTime={display}
    >
      {characters.map((char, index) =>
        char === ":" ? (
          <span
            key={`separator-${index}`}
            className="timer-display-separator"
            aria-hidden="true"
            >
              :
          </span>
        )
        : (
            <AnimatedDigit key={`${index}-${char}`} value={char} />
          )
        )}
    </time>
  );
}
