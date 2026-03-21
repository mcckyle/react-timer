//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 20 March 2026
//Description: This file contains the time field for the timer React project.

import "./TimeField.css";

export default function TimeField({ label, value, onChange, onBlur })
{
  const id = `time-${label}`;
  const labelId = `${id}-label`;

  function handleChange(e)
  {
    const raw = e.target.value;

    if (raw === "")
    {
      onChange(0);
      return;
    }

    const parsed = Math.max(0, Number.parseInt(raw, 10) || 0);
    onChange(parsed);
  }

  function handleWheel(e)
  {
    /* Prevent scroll wheel increment. */
    e.currentTarget.blur();
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
    {
      onBlur();
    }
  }

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

        aria-labelledby={labelId}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
      />
      <span className="time-unit" aria-hidden="true">{label}</span>
    </div>
  );
}
