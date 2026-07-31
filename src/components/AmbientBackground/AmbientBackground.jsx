//File name: AmbientBackground.jsx
//Author: Kyle McColgan
//Date: 31 July 2026
//Description: This file contains the background component for the timer React project.

import "./AmbientBackground.css";

export default function AmbientBackground()
{
    return (
        <div className="ambient" aria-hidden="true">
          <div className="ambient-space" />
          <div className="ambient-stars ambient-stars-far" />
          <div className="ambient-stars ambient-stars-near" />
          <div className="ambient-nebula ambient-nebula-back" />
          <div className="ambient-nebula ambient-nebula-front" />
          <div className="ambient-haze" />
          <div className="ambient-bloom" />
          <div className="ambient-vignette" />
        </div>
    );
}
