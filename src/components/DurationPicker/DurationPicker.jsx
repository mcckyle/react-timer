//File name: DurationPicker.jsx
//Author: Kyle McColgan
//Date: 29 October 2026
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

  /* Sync only when the duration changes externally. */
  useEffect(() =>
  {
    const next = splitDuration(duration);
    setHours(next.hours);
    setMinutes(next.minutes);
    setSeconds(next.seconds);
  }, [duration]);

  const commit = () =>
  {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    const nextDuration = totalSeconds * 1000;

    if (nextDuration <= 0)
    {
      const current = splitDuration(duration);
      setHours(current.hours);
      setMinutes(current.minutes);
      setSeconds(current.seconds);

      return;
    }

    if (nextDuration !== duration)
    {
      onSelect(nextDuration);
    }
  };

  const handleChange = (setter, max) => (value) =>
  {
    const parsed = Number.parseInt(value, 10);
    const next = Number.isFinite(parsed) ? parsed : 0;
    setter(Math.max(0, Math.min(max, next)));
  };

  const handleCustomKeyDown = (event) =>
  {
    if (event.key !== "Enter")
    {
      return;
    }

    event.preventDefault();
    commit();
    event.target.blur();
  };

  const handleCustomBlur = (event) =>
  {
    if (!event.currentTarget.contains(event.relatedTarget))
    {
      commit();
    }
  };

  return (
    <div
      className="duration-picker"
      role="group"
      aria-label="Timer duration"
    >
      <div
        className="duration-picker-presets"
        role="group"
        aria-label="Preset durations"
      >
        {PRESETS.map(({ label, ms }) => (
          <button
            key={ms}
            type="button"
            className="duration-pill"
            aria-pressed={duration === ms}
            onClick={() => onSelect(ms)}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        className="duration-custom"
        role="group"
        aria-label="Custom duration"
        onKeyDown={handleCustomKeyDown}
        onBlur={handleCustomBlur}
      >
        <TimeField label="h" value={hours} max={99} onChange={handleChange(setHours, 99)} />
        <span className="sep" aria-hidden="true">:</span>
        <TimeField label="m" value={minutes} max={59} onChange={handleChange(setMinutes, 59)} />
        <span className="sep" aria-hidden="true">:</span>
        <TimeField label="s" value={seconds} max={59} onChange={handleChange(setSeconds, 59)} />
      </div>
    </div>
  );
}
