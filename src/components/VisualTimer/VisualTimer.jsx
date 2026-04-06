//File name: VisualTimer.jsx
//Author: Kyle McColgan
//Date: 6 April 2026
//Description: This file contains the visual timer component for the timer React project.

import "./VisualTimer.css";

export default function VisualTimer({ progress })
{
  const clamped = Math.max(0, Math.min(1, progress));

  //Smooth easing curve (replaces CSS pow())
  const eased = Math.pow(clamped, 1.15);
  const inverse = 1 - eased;

  return (
    <div
      className="visual-timer"
      style={{
        "--progress": clamped,
        "--progress-eased": eased,
        "--progress-inverse": inverse
      }}
      aria-hidden="true"
    >
      <div className="visual-timer-hourglass">
        <div className="visual-timer-sand visual-timer-sand-top" />
        <div className="visual-timer-sand visual-timer-sand-flow" />
        <div className="visual-timer-sand visual-timer-sand-bottom" />
      </div>
    </div>
  );
}
