//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 23 February 2026
//Description: This file contains the past timers component for the React timer project.

import { formatDuration } from "../../utils/formatDuration";
import "./PastTimers.css";

const formatTime = (date) =>
  date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

const toValidDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function PastTimers({ timers, onClear })
{
  const hasTimers = timers.length > 0;

  return (
    <aside className="past-timers" aria-label="Completed timers">

     {hasTimers && (
       <header className="past-timers-header">
         <h2 className="past-timers-title">Completed</h2>
         <button
           type="button"
           className="past-timers-clear"
           onClick={onClear}
         >
           Clear
         </button>
       </header>
      )}

      <ul className="past-timers-list">
        { ! hasTimers ? (
          <li className="past-timer-empty">
            No completed timers yet
          </li>
        ) : (
          timers.map((timer, i) => {
            const completedDate = toValidDate(timer.completedAt);

            return (
              <li key={i} className="past-timer-item">
                <span className="past-timer-duration">
                  {formatDuration(timer.duration)}
                </span>

                {completedDate && (
                  <time
                    className="past-timer-time"
                    dateTime={completedDate.toISOString()}
                  >
                    {formatTime(completedDate)}
                  </time>
                )}
              </li>
            );
        })
      )}
      </ul>
    </aside>
  );
}
