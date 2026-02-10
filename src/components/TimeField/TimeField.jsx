//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 9 February 2026
//Description: This file contains the time field for the React timer project.

import "./TimeField.css";

export default function TimeField({ label, value, onChange, onBlur })
{
  return (
    <div className="time-field">
      <input
        type="number"
        min="0"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => e.key === "Enter" && onBlur()}
        aria-label={label}
      />
      <span className="time-unit">{label}</span>
    </div>
  );
}
