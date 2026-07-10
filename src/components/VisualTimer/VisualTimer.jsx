//File name: VisualTimer.jsx
//Author: Kyle McColgan
//Date: 9 July 2026
//Description: This file contains the visual timer component for the timer React project.

import "./VisualTimer.css";

export default function VisualTimer({ progress })
{
  const clampedProgress = Math.max(0, Math.min(1, progress));

  //Smooth easing curve (replaces CSS pow())
  const visualEnergy = 1 - Math.pow(clampedProgress, 1.15);

  return (
    <div
      className="visual-timer"
      style={{
        "--visual-progress": clampedProgress,
        "--visual-energy": visualEnergy,
      }}
      aria-hidden="true"
    >
      <div className="visual-timer-core">
        <div className="visual-timer-glass">
          <div className="visual-timer-sand visual-timer-sand-top" />
          <div className="visual-timer-sand visual-timer-sand-flow" />
          <div className="visual-timer-sand visual-timer-sand-bottom" />
        </div>
      </div>
    </div>
  );
}
