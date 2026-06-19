//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 18 June 2026
//Description: This file contains the time display for the timer React project.

import { useMemo } from "react";
import { motion } from "motion/react";
import { formatDuration } from "../../utils/formatDuration";
import "./TimerDisplay.css";

const TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1], };

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
            <motion.span
              key={`${index}-${char}`}
              className="timer-display-digit"
              initial={{ opacity: 0.6 }}
              animate={{ opacity: 1 }}
              transition={TRANSITION}
            >
              {char}
            </motion.span>
          );
        })}
    </time>
  );
}
