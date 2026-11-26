//File name: DurationPicker.jsx
//Author: Kyle McColgan
//Date: 25 November 2026
//Description: This file contains the time duration picker for the timer React project.

import { useEffect, useState, useCallback } from "react";
import { splitDuration } from "../../utils/formatDuration";
import TimeField from "../TimeField/TimeField.jsx";
import "./DurationPicker.css";

const PRESETS  = [
  { label: "5m", ms: 5 * 60 * 1000 },
  { label: "10m", ms: 10 * 60 * 1000 },
  { label: "25m", ms: 25 * 60 * 1000 },
];

const MAX_HOURS = 99;
const MAX_MINUTES = 59;
const MAX_SECONDS = 59;

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

  const commit = useCallback(() =>
  {
    const nextDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;

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
  }, [duration, hours, minutes, seconds, onSelect]);

  const createChangeHandler = useCallback((setter, max) => {
    return (value) => {
      const parsed = Number.parseInt(value, 10);
      const next = Number.isFinite(parsed) ? parsed : 0;
      setter(Math.min(max, Math.max(0, next)));
    }
  }, []);

  const handleHoursChange = createChangeHandler(setHours, MAX_HOURS);
  const handleMinutesChange = createChangeHandler(setMinutes, MAX_MINUTES);
  const handleSecondsChange = createChangeHandler(setSeconds, MAX_SECONDS);

  const handleKeyDown = (event) =>
  {
    if (event.key !== "Enter")
    {
      return;
    }

    event.preventDefault();
    commit();
    event.target.blur();
  };

  const handleBlur = (event) =>
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
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        <TimeField label="h" value={hours} max={MAX_HOURS} onChange={handleHoursChange} />
        <span className="duration-picker-separator" aria-hidden="true">:</span>
        <TimeField label="m" value={minutes} max={MAX_MINUTES} onChange={handleMinutesChange} />
        <span className="duration-picker-separator" aria-hidden="true">:</span>
        <TimeField label="s" value={seconds} max={MAX_SECONDS} onChange={handleSecondsChange} />
      </div>
    </div>
  );
}
