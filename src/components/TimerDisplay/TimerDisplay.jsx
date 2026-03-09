//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 8 March 2026
//Description: This file contains the time display for the timer React project.

import { motion, AnimatePresence } from "motion/react";
import { formatTime } from "../../utils/formatTime";
import "./TimerDisplay.css";

export default function TimerDisplay({ timeLeft })
{
    const display = formatTime(timeLeft);
    const characters = display.split("");

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
                    initial={{ y: -16, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 16, opacity: 0 }}
                    transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
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
