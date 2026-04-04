//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 1 April 2026
//Description: This file contains the time field for the timer React project.

import { useRef } from "react";
import "./TimeField.css";

export default function TimeField({ label, value, onChange, onBlur })
{
  const id = `time-${label}`;
  const labelId = `${id}-label`;

  const startY = useRef(0);
  const startValue = useRef(0);
  const dragging = useRef(false);

  function clamp(v)
  {
    return Math.max(0, v);
  }

  function handlePointerDown(e)
  {
    dragging.current = true;
    startY.current = e.clientY;
    startValue.current = value;

    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e)
  {
    if (!dragging.current)
    {
      return;
    }

    const deltaY = startY.current - e.clientY;

    //Velocity scaling (slow = precise, fast = jump).
    const speed = Math.abs(deltaY);
    const multiplier =
      speed > 120 ? 10 :
      speed > 60 ? 5 :
      speed > 20 ? 2 : 1;

    const next = clamp(startValue.current + Math.floor(deltaY / 8) * multiplier);
    onChange(next);
  }

  function handlePointerUp(e)
  {
    dragging.current = false;
    e.currentTarget.releasePointerCapture(e.pointerId);
    onBlur?.();
  }

  function handleChange(e)
  {
    const raw = e.target.value;

    if (raw === "")
    {
      onChange(0);
      return;
    }

    const parsed = clamp(0, Number.parseInt(raw, 10) || 0);
    onChange(parsed);
  }

  function handleWheel(e)
  {
    e.preventDefault();
    const direction = e.deltaY > 0 ? -1 : 1;
    onChange(clamp(value + direction));
  }

  function handleKeyDown(e)
  {
    if (e.key === "Enter")
    {
      onBlur?.();
    }
    if (e.key === "ArrowUp")
    {
      onChange(value + 1);
    }
    if (e.key === "ArrowDown")
    {
      onChange(clamp(value - 1));
    }
  }

  return (
    <div
      className="time-field"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
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
