//File name: DurationPicker.jsx
//Author: Kyle McColgan
//Date: 18 June 2026
//Description: This file contains the time duration picker for the timer React project.

import { useEffect, useState } from "react";
import { splitDuration } from "../../utils/splitDuration.jsx";
import TimeField from "../TimeField/TimeField.jsx";
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
  const isCustom = !PRESETS.some(p => p.ms === duration);

  /* Sync only when the duration changes externally. */
  useEffect(() =>
  {
    const { hours, minutes, seconds } = splitDuration(duration);
    setHours(hours);
    setMinutes(minutes);
    setSeconds(seconds);
  }, [duration]);

  const commit = (h = hours, m = minutes, s = seconds) =>
  {
    const ms = ((h * 3600) + (m * 60) + s) * 1000;

    if (ms > 0)
    {
      onSelect(ms);
    }
  };

  const handleChange = (setter, max) => (value) =>
  {
    const parsed = Math.max(0, Math.min(max, Number.parseInt(value, 10) || 0));
    setter(parsed);
  };

  return (
    <section
      className="duration-picker"
      role="group"
      aria-label="Timer duration"
    >
      <nav
        className="duration-picker-presets"
        aria-label="Preset durations"
      >
        {PRESETS.map(({ label, ms }) =>
        {
          const active = duration === ms;

          return (
            <button
              key={label}
              type="button"
              className={`duration-pill${active ? " is-active" : ""}`}
              aria-pressed={active && !isCustom}
              onClick={() => onSelect(ms)}
            >
              {label}
            </button>
          );
        })}
      </nav>

      <div
        className="duration-custom"
        onKeyDown={(e) => e.key === "Enter" && commit()}
      >
        <TimeField label="h" value={hours} max={99} onChange={handleChange(setHours, 99)} onBlur={() => commit()} />
        <span className="sep" aria-hidden="true">:</span>
        <TimeField label="m" value={minutes} max={59} onChange={handleChange(setMinutes, 59)} onBlur={() => commit()} />
        <span className="sep" aria-hidden="true">:</span>
        <TimeField label="s" value={seconds} max={59} onChange={handleChange(setSeconds, 59)} onBlur={() => commit()} />
      </div>
    </section>
  );
}
