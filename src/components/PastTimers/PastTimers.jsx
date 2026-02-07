//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 6 February 2026
//Description: This file contains the past timers component for the React timer project.

import "./PastTimers.css";

export default function PastTimers({ timers })
{
  return (
    <aside className="past-timers" aria-label="Completed timers">
      <ul className="past-timers-list">
        {timers.length === 0 ? (
            <li className="past-timer-empty">
              No completed timers yet
            </li>
        ) : (
            timers.map((_, i) => (
                <li key={i} className="past-timer-item">
                  Session {i + 1} completed
                </li>
            ))
        )}
      </ul>
    </aside>
  );
}
