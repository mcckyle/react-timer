//File name: DurationPicker.jsx
//Author: Kyle McColgan
//Date: 13 February 2026
//Description: This file contains the time duration picker for the React timer project.

import { useEffect, useState, useRef } from "react";
import TimeField from "../TimeField/TimeField.jsx";
import TimeSeparator from "../TimeSeparator/TimeSeparator.jsx";
import "./DurationPicker.css";

const PRESETS  = [
  { label: "5m", ms: 5 * 60 * 1000 },
  { label: "10m", ms: 10 * 60 * 1000 },
  { label: "25m", ms: 25 * 60 * 1000 },
];

export default function DurationPicker({ duration, onSelect })
{
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const prevDurationRef = useRef(duration);

  /* Sync external duration only if it actually changes. */
  useEffect(() => {
    if (duration !== prevDurationRef.current)
    {
      prevDurationRef.current = duration;
      const totalSeconds = Math.floor(duration / 1000);
      setHours(Math.floor(totalSeconds / 3600));
      setMinutes(Math.floor((totalSeconds % 3600) / 60));
      setSeconds(totalSeconds % 60);
    }
  }, [duration]);

  const emitDuration = (h, m, s) => {
    const ms = ((h * 3600) + (m * 60) + s) * 1000;

    if (ms > 0)
    {
      onSelect(ms);
    }
  };

  const handleChange = (setter, value) => {
    setter(Math.max(0, Number(value) || 0));
  };

  const handleCommit = () => {
    emitDuration(hours, minutes, seconds);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter")
    {
      handleCommit();
    }
  };

  return (
      <div
        className="duration-picker"
        role="group"
        aria-label="Select duration"
      >
        <div className="duration-presets">
          {PRESETS.map(({ label, ms }) => {
            const isActive = duration === ms;

            return (
              <button
                key={label}
                type="button"
                className={`duration-pill${isActive ? " is-active" : ""}`}
                aria-pressed={isActive}
                onClick={() => onSelect(ms)}
              >
                {label}
              </button>
            );
          })}
      </div>

      <div className="duration-custom" onKeyDown={handleKeyDown}>
        <TimeField
          label="h"
          value={hours}
          onChange={(v) => handleChange(setHours, v)}
          onBlur={handleCommit}
        />
        <TimeSeparator />
        <TimeField
          label="m"
          value={minutes}
          onChange={(v) => handleChange(setMinutes, v)}
          onBlur={handleCommit}
        />
        <TimeSeparator />
        <TimeField
          label="s"
          value={seconds}
          onChange={(v) => handleChange(setSeconds, v)}
          onBlur={handleCommit}
        />
      </div>
    </div>
  );
}
