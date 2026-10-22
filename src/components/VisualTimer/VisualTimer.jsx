//File name: VisualTimer.jsx
//Author: Kyle McColgan
//Date: 21 October 2026
//Description: This file contains the visual timer component for the timer React project.

import "./VisualTimer.css";

export default function VisualTimer({ progress })
{
  //Progress represents the fraction of time remaining, from 0 to 1.
  const value = Number(progress);
  const visualProgress = Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : 0;

  //Smooth easing curve.
  const visualEnergy = 1 - Math.pow(visualProgress, 1.15);

  return (
    <div
      className="visual-timer"
      style={{
        "--visual-progress": visualProgress,
        "--visual-energy": visualEnergy,
        "--visual-scale": 1 + visualEnergy * 0.025,
        "--visual-halo-opacity": 0.68 + visualEnergy * 0.32,
        "--visual-halo-blur": `${30 + visualEnergy * 24}px`,
        "--visual-top-opacity": 0.16 + visualProgress * 0.84,
        "--visual-flow-opacity": 0.18 + visualEnergy * 0.68,
        "--visual-bottom-opacity": 0.14 + visualEnergy * 0.86,
      }}
      aria-hidden="true"
    >
      <div className="visual-timer-core">
        <div className="visual-timer-glass">
          <div className="visual-timer-sand visual-timer-sand-top" />
          <div className="visual-timer-sand visual-timer-sand-flow" />
          <div className="visual-timer-sand visual-timer-sand-bottom" />

          <span className="visual-timer-highlight" />
          <span className="visual-timer-edge" />
        </div>
      </div>
    </div>
  );
}
