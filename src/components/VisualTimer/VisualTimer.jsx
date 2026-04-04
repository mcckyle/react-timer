//File name: VisualTimer.jsx
//Author: Kyle McColgan
//Date: 3 April 2026
//Description: This file contains the visual timer component for the timer React project.

import "./VisualTimer.css";

export default function VisualTimer({ progress })
{
  const clamped = Math.max(0, Math.min(1, progress));

  //Smooth easing curve (replaces CSS pow())
  const eased = Math.pow(clamped, 1.2);
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
      <div className="hourglass">
        <div className="sand top" />
        <div className="sand flow" />
        <div className="sand bottom" />
      </div>
    </div>
  );
}
