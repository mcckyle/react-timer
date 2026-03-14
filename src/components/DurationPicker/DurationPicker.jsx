//File name: DurationPicker.jsx
//Author: Kyle McColgan
//Date: 13 March 2026
//Description: This file contains the time duration picker for the timer React project.

import { useEffect, useState } from "react";
import { splitDuration } from "../../utils/splitDuration.jsx";
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
  const split = splitDuration(duration);
  const [hours, setHours] = useState(split.hours);
  const [minutes, setMinutes] = useState(split.minutes);
  const [seconds, setSeconds] = useState(split.seconds);

  /* Sync only when the duration changes externally. */
  useEffect(() => {
    const { hours, minutes, seconds } = splitDuration(duration);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }, [duration]);

  const emitDuration = (h, m, s) => {
    const ms = ((h * 3600) + (m * 60) + s) * 1000;

    if (ms > 0)
    {
      onSelect(ms);
    }
  };

  const commit = () => emitDuration(hours, minutes, seconds);
  const handleChange = (setter) => (value) =>
  {
    const parsed = Math.max(0, Number.parseInt(value, 10) || 0);
    setter(parsed);
  };

  return (
    <section
      className="duration-picker"
      role="group"
      aria-label="Select timer duration"
    >
      <nav className="duration-presets" aria-label="Preset durations">
        {PRESETS.map(({ label, ms }) => {
          const active = duration === ms;

          return (
            <button
              key={label}
              type="button"
              className={`duration-pill${active ? " is-active" : ""}`}
              aria-pressed={active}
              onClick={() => onSelect(ms)}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div
        className="duration-custom"
        aria-label="Custom duration"
        onKeyDown={(e) => e.key === "Enter" && commit()}
      >
        <TimeField
          label="h"
          value={hours}
          onChange={handleChange(setHours)}
          onBlur={commit}
        />
        <TimeSeparator />
        <TimeField
          label="m"
          value={minutes}
          onChange={handleChange(setMinutes)}
          onBlur={commit}
        />
        <TimeSeparator />
        <TimeField
          label="s"
          value={seconds}
          onChange={handleChange(setSeconds)}
          onBlur={commit}
        />
      </div>
  </section>
  );
}
