//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 21 October 2026
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

  const clamp = (nextValue) =>
  {
    return Math.max(0, Math.min(max, nextValue));
  };

  const handlePointerDown = (event) =>
  {
    if ((event.target instanceof HTMLInputElement) || (event.button !== 0))
    {
      return;
    }

    dragging.current = true;
    startY.current = event.clientY;
    startValue.current = value;

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  const handlePointerMove = (event) =>
  {
    if (!dragging.current)
    {
      return;
    }

    //Velocity scaling (slow = precise, fast = jump).
    const deltaY = startY.current - event.clientY;
    const distance = Math.abs(deltaY);
    const baseStep = Math.trunc(deltaY / 12);
    const multiplier =
      distance > 140 ? 12 :
      distance > 80 ? 6 :
      distance > 30 ? 2 : 1;

    const nextValue = clamp(startValue.current + baseStep * multiplier);
    onChange(nextValue);
  }

  const handlePointerUp = (event) =>
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
  }

  const handleChange = (event) =>
  {
    const raw = event.target.value;

    onChange(raw === "" ? 0 : clamp(Number.parseInt(raw, 10) || 0));
  }

  const handleWheel = (event) =>
  {
    if (document.activeElement !== event.currentTarget)
    {
      return;
    }

    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    onChange(clamp(value + direction));
  }

  const handleKeyDown = (event) =>
  {
    if ((event.key !== "ArrowUp") && (event.key !== "ArrowDown"))
    {
      return;
    }

    event.preventDefault();
    onChange(clamp(value + (event.key === "ArrowUp" ? 1 : -1)));
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
        {label === "h" ? "Hours" : label === "m" ? "Minutes" : "Seconds"}
      </label>

      <input
        id={id}
        type="number"

        min="0"
        max={max}
        step="1"

        inputMode="numeric"
        autoComplete="off"
        aria-labelledby={labelId}

        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
      />
      <span className="time-unit" aria-hidden="true">{label}</span>
    </div>
  );
}
