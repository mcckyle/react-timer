//File name: TimeField.jsx
//Author: Kyle McColgan
//Date: 25 November 2026
//Description: This file contains the time field for the timer React project.

import { useRef, useId } from "react";
import "./TimeField.css";

export default function TimeField({ label, value, max = Number.MAX_SAFE_INTEGER, onChange })
{
  const generatedId = useId();
  const id = `time-${label}-${generatedId}`;
  const labelId = `${id}-label`;
  const descriptionId = `${id}-description`;

  const startY = useRef(0);
  const startValue = useRef(0);
  const activePointerId = useRef(null);

  const clamp = (nextValue) => Math.max(0, Math.min(max, nextValue));
  const fieldName =
    label === "h" ? "Hours" :
    label === "m" ? "Minutes" :
    "Seconds";

  const handlePointerDown = (event) =>
  {
    if ((event.button !== 0) || (event.target instanceof HTMLInputElement))
    {
      return;
    }

    activePointerId.current = event.pointerId;
    startY.current = event.clientY;
    startValue.current = value;

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) =>
  {
    if (event.pointerId !== activePointerId.current)
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
  };

  const handlePointerUp = (event) =>
  {
    if (event.pointerId !== activePointerId.current)
    {
      return;
    }

    activePointerId.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId))
    {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleLostPointerCapture = () =>
  {
    activePointerId.current = null;
  };

  const handleChange = (event) =>
  {
    const nextValue = event.currentTarget.valueAsNumber;
    onChange(Number.isFinite(nextValue) ? clamp(Math.trunc(nextValue)) : 0);
  };

  const handleWheel = (event) =>
  {
    if (!event.currentTarget.matches(":focus"))
    {
      return;
    }

    event.preventDefault();
    const direction = event.deltaY > 0 ? -1 : 1;
    onChange(clamp(value + direction));
  };

  const handleKeyDown = (event) =>
  {
    if ((event.key !== "ArrowUp") && (event.key !== "ArrowDown"))
    {
      return;
    }

    event.preventDefault();
    const direction = event.key === "ArrowUp" ? 1 : -1;
    onChange(clamp(value + direction));
  };

  return (
    <div
      className="time-field"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onLostPointerCapture={handleLostPointerCapture}
      title={`Adjust ${fieldName.toLowerCase()} by dragging or using the arrow keys`}
    >
      <label id={labelId} htmlFor={id} className="time-field-sr-only">
        {fieldName}
      </label>
      <span id={descriptionId} className="time-field-sr-only">
        Use the arrow keys to adjust by one, or drag vertically to adjust faster.
      </span>
      <input
        id={id}
        type="number"

        min="0"
        max={max}
        step="1"

        inputMode="numeric"
        autoComplete="off"
        aria-describedby={descriptionId}

        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onWheel={handleWheel}
      />
      <span className="time-unit" aria-hidden="true">{label}</span>
    </div>
  );
}
