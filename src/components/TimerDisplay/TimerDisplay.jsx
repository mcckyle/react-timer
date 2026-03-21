//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 20 March 2026
//Description: This file contains the time display for the timer React project.

import { motion } from "motion/react";
import { useMemo } from "react";
import { formatTime } from "../../utils/formatTime";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
  //Only update the display when the visible second changes.
  const seconds = Math.ceil(timeLeft / 1000);
  const display = useMemo(() => formatTime(seconds * 1000), [seconds]);
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
              className="timer-separator"
              aria-hidden="true"
            >
              :
            </span>
          );
        }

        return (
          <span key={`digit-${index}`} className="timer-digit-wrapper">
            <motion.span
              key={`${index}-${char}`}
              className="timer-digit"
              initial={{ y: -14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </time>
  );
}
