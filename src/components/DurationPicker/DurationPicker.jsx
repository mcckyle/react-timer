//File name: DurationPicker.jsx
//Author: Kyle McColgan
//Date: 6 February 2026
//Description: This file contains the time duration picker for the React timer project.

import "./DurationPicker.css";

export const DURATIONS  = [
  { label: "5m", value: 5 * 60 * 1000 },
  { label: "10m", value: 10 * 60 * 1000 },
  { label: "25m", value: 25 * 60 * 1000 },
];

export default function DurationPicker({ duration, onSelect })
{
    return (
        <div
          className="duration-picker"
          role="group"
          aria-label="Select timer duration"
        >
          {DURATIONS.map(d => {
            const isActive = duration === d.value;

            return (
              <button
                key={d.value}
                type="button"
                className={`duration-pill ${isActive ? "active" : ""}`}
                aria-pressed={isActive}
                onClick={() => onSelect(d.value)}
              >
                {d.label}
              </button>
            );
          })}
        </div>
    );
}
