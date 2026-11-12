//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 11 November 2026
//Description: This file contains the time display for the timer React project.

import { formatDuration } from "../../utils/formatDuration";
import AnimatedDigit from "../AnimatedDigit/AnimatedDigit.jsx";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
  //Update the visible digits only once per second.
  const seconds = Math.max(0, Math.ceil(timeLeft / 1000));
  const display = formatDuration(seconds * 1000);

  return (
    <time
      className="timer-display"
      role="timer"
      aria-live="off"
      aria-label={`${display} remaining`}
    >
      {[...display].map((char, index) =>
        char === ":" ? (
          <span
            key={`separator-${index}`}
            className="timer-display-separator"
            aria-hidden="true"
          >
            :
          </span>
        ) : (
          <AnimatedDigit key={`digit-${index}`} value={char} />
          )
        )}
    </time>
  );
}
