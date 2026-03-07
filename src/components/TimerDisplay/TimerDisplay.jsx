//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 6 March 2026
//Description: This file contains the time display for the timer React project.

import { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { formatTime } from "../../utils/formatTime";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
    const display = useMemo(() => formatTime(timeLeft), [timeLeft]);

    return (
      <time
        className="timer-display"
        role="timer"
        aria-live="polite"
        aria-atomic="true"
        dateTime={display}
      >
        {display.split("").map((char, index) =>
        {
          const isSeparator = char === ":";

          return (
            <span key={index} className="timer-digit-wrapper">
              {isSeparator ? (
                <span className="timer-separator">{char}</span>
              ) : (
                <AnimatePresence mode="popLayout">
                  <motion.span
                    layout
                    key={`${index}-${char}`}
                    initial={{ y: -14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 14, opacity: 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="timer-digit"
                  >
                    {char}
                  </motion.span>
                </AnimatePresence>
              )}
            </span>
          );
        })}
      </time>
    );
}
