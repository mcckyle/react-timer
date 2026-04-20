//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 19 April 2026
//Description: This file contains the time display for the timer React project.

import { useMemo } from "react";
import { motion } from "motion/react";
import { formatDuration } from "../../utils/formatDuration";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
  //Only update the display when the visible second changes.
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
      dateTime={display}
    >
      {characters.map((char, index) =>
      {
        if (char === ":")
        {
          return (
            <span
              key={`sep-${index}`}
              className="timer-display-separator"
              aria-hidden="true"
            >
              :
            </span>
          );
        }

        return (
          <span key={`digit-${index}`} className="timer-display-digit-wrapper">
            <motion.span
              key={`${index}-${char}`}
              className="timer-display-digit"
              initial={{ y: -3, opacity: 0 }}
              animate={{ y: 0, opacity: 1}}
              exit={{ y: 3, opacity: 0 }}
              transition={{ duration: 0.16, ease: [0.33, 1, 0.68, 1] }}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </time>
  );
}
