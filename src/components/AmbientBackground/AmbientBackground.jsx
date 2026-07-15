//File name: AmbientBackground.jsx
//Author: Kyle McColgan
//Date: 15 July 2026
//Description: This file contains the background component for the timer React project.

import "./AmbientBackground.css";

export default function AmbientBackground()
{
    return (
        <div className="ambient" aria-hidden="true">
          <div className="ambient-cosmos">
            <div className="ambient-space" />
            <div className="ambient-stars" />
          </div>

          <div className="ambient-nebula-system">
            <div className="ambient-nebula" />
            <div className="ambient-glow" />
            <div className="ambient-haze" />
          </div>

          <div className="ambient-particles" />
          <div className="ambient-vignette" />
        </div>
    );
}
