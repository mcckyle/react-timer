//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 9 September 2026
//Description: This file contains the time field for the timer React project.

import { useRef } from "react";
import "./TimeField.css";

export default function TimeField({ label, value, max = Number.MAX_SAFE_INTEGER, onChange, onBlur })
{
  const id = `time-${label}`;
  const labelId = `${id}-label`;

  const startY = useRef(0);
  const startValue = useRef(0);
  const dragging = useRef(false);

  const clamp = (valueToClamp) =>
  {
    return Math.max(0, Math.min(max, valueToClamp));
  };

  function handlePointerDown(event)
  {
    if (event.target instanceof HTMLInputElement)
    {
      return;
    }

    dragging.current = true;
    startY.current = event.clientY;
    startValue.current = value;

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event)
  {
    if (!dragging.current)
    {
      return;
    }

    const deltaY = startY.current - event.clientY;

    //Velocity scaling (slow = precise, fast = jump).
    const speed = Math.abs(deltaY);
    const step = Math.trunc(deltaY / 12);
    const multiplier =
      speed > 140 ? 12 :
      speed > 80 ? 6 :
      speed > 30 ? 2 : 1;

    const next = clamp(startValue.current + step * multiplier);
    onChange(next);
  }

  function handlePointerUp(event)
  {
    if (!dragging.current)
    {
      return;
    }

    dragging.current = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId))
    {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    onBlur?.();
  }

  function handleChange(event)
  {
    const raw = event.target.value;

    if (raw === "")
    {
      onChange(0);
      return;
    }

    const parsed = clamp(Number.parseInt(raw, 10) || 0);
    onChange(parsed);
  }

  function handleWheel(event)
  {
    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    onChange(clamp(value + direction));
  }

  function handleKeyDown(event)
  {
    if (event.key === "Enter")
    {
      onBlur?.();
    }
    if (event.key === "ArrowUp")
    {
      event.preventDefault();
      onChange(clamp(value + 1));
    }
    if (event.key === "ArrowDown")
    {
      event.preventDefault();
      onChange(clamp(value - 1));
    }
  }

  return (
    <div
      className="time-field"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      title={`Adjust ${label} by dragging or using the arrow keys`}
    >
      <label id={labelId} htmlFor={id} className="sr-only">
        {label} value
      </label>

      <input
        id={id}
        type="number"

        min="0"
        max={max}
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
