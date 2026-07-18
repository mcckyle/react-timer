//File name: AmbientBackground.jsx
//Author: Kyle McColgan
//Date: 17 July 2026
//Description: This file contains the background component for the timer React project.

import "./AmbientBackground.css";

export default function AmbientBackground()
{
    return (
        <div className="ambient" aria-hidden="true">
          <div className="ambient-space" />
          <div className="ambient-stars" />
          <div className="ambient-nebula" />
          <div className="ambient-bloom" />
          <div className="ambient-vignette" />
        </div>
    );
}
