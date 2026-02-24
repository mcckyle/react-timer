//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 23 February 2026
//Description: This file contains the time field for the React timer project.

import "./TimeField.css";

export default function TimeField({ label, value, onChange, onBlur })
{
  const id = `time-${label}`;

  return (
    <div className="time-field">
      <label htmlFor={id} className="sr-only">
        {label} value
      </label>

      <input
        id={id}
        type="number"
        min="0"
        step="1"
        inputMode="numeric"
        autoComplete="off"
        pattern="[0-9]*"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => e.key === "Enter" && onBlur()}
        onWheel={(e) => e.currentTarget.blur()}
      />
      <span className="time-unit" aria-hidden="true">{label}</span>
    </div>
  );
}
