//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 6 March 2026
//Description: This file contains the time field for the timer React project.

import "./TimeField.css";

export default function TimeField({ label, value, onChange, onBlur })
{
  const id = `time-${label}`;
  const labelId = `${id}-label`;

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v === "" ? 0 : v);
  };

  const handleWheel = (e) =>
  {
    e.currentTarget.blur();
  };

  return (
    <div className="time-field">
      <label id={labelId} htmlFor={id} className="sr-only">
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
        aria-label={labelId}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onKeyDown={(e) => e.key === "Enter" && onBlur()}
        onWheel={handleWheel}
      />
      <span className="time-unit" aria-hidden="true">{label}</span>
    </div>
  );
}
