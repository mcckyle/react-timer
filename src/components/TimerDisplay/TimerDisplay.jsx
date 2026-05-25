//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 25 May 2026
//Description: This file contains the time display for the timer React project.

import { useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatDuration } from "../../utils/formatDuration";
import "./TimerDisplay.css";

const TRANSITION = { duration: 0.16, ease: [0.22, 1, 0.36, 1], };

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
      <div className="timer-display-inner">
        <AnimatePresence mode="popLayout" initial={false}>
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
              <span key={`wrapper-${index}`} className="timer-display-digit-wrapper">
                <motion.span
                  key={`${index}-${char}`}
                  className="timer-display-digit"
                  initial={{ opacity: 0, y: "10%", filter: "blur(4px)", }}
                  animate={{ opacity: 1, y: "0%", filter: "blur(0px)", }}
                  exit={{ opacity: 0, y: "-10%", filter: "blur(4px)", }}
                  transition={TRANSITION}
                >
                  {char}
                </motion.span>
              </span>
            );
          })}
        </AnimatePresence>
      </div>
    </time>
  );
}
