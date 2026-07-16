//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 16 July 2026
//Description: This file contains the time display for the timer React project.

import { useMemo } from "react";
import { formatDuration } from "../../utils/formatDuration";
import AnimatedDigit from "../AnimatedDigit/AnimatedDigit.jsx";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
  //Only update visible digits once per second.
  const seconds = Math.ceil(timeLeft / 1000);
  const display = useMemo(() =>
  {
    return formatDuration(seconds * 1000)
  }, [seconds]);
  const characters = useMemo(() => [...display], [display]);

  return (
    <time
      className="timer-display"
      role="timer"
      aria-live="off"
      aria-atomic="true"
      aria-label={`${seconds} seconds remaining`}
      dateTime={display}
    >
      {characters.map((char, index) =>
        {
          if (char === ":")
          {
            return (
              <span
                key={`separator-${index}`}
                className="timer-display-separator"
                aria-hidden="true"
              >
                :
              </span>
            );
          }

          return (
            <AnimatedDigit key={`${index}-${char}`} value={char} />
          );
        })}
    </time>
  );
}
