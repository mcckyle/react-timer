//File name: TimerDisplay.jsx
//Author: Kyle McColgan
//Date: 6 February 2026
//Description: This file contains the time display for the React timer project.

import { useMemo } from "react";
import "./TimerDisplay.css";

const formatTime = ms => {
    const totalSeconds = Math.ceil(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const pad = n => (n < 10 ? "0" + n : n);

    return `${pad(minutes)}:${pad(seconds)}`;
};

export default function TimerDisplay({ timeLeft })
{
    const display = useMemo(() => formatTime(timeLeft), [timeLeft]);

    return (
        <time className="timer-display" aria-live="polite" aria-atomic="true">
          {display}
        </time>
    );
}
