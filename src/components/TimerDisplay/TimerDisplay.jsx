//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 23 February 2026
//Description: This file contains the time display for the React timer project.

import { useMemo } from "react";
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
        {display}
      </time>
    );
}
