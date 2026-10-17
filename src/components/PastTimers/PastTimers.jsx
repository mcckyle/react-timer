//File name: PastTimers.jsx
//Author: Kyle McColgan
//Date: 17 October 2026
//Description: This file contains the past timers component for the timer React project.

import { formatDuration, formatTime, toValidDate } from "../../utils/formatDuration";
import "./PastTimers.css";

export default function PastTimers({ timers, onClear })
{
  const hasTimers = timers.length > 0;

  return (
    <section className="past-timers" aria-label="Completed timer history">
     {hasTimers && (
       <header className="past-timers-header">
         <h2 className="past-timers-title">
          <span>Completed</span>
          <span className="past-timers-count">
            <span className="sr-only">
              {timers.length} completed timers
            </span>
            <span aria-hidden="true">{timers.length}</span>
          </span>
         </h2>
         <button
           type="button"
           className="past-timers-clear"
           onClick={onClear}
           aria-label="Clear completed timer history"
         >
           Clear
         </button>
       </header>
      )}

      <ul
        className="past-timers-list"
        tabIndex="0"
        aria-label="Completed timers"
        aria-live="polite"
        aria-relevant="additions"
      >
        {!hasTimers ? (
          <li className="past-timers-empty">
            No completed timers yet
          </li>
        ) : (
          timers.map((timer, index) =>
          {
            const completedDate = toValidDate(timer.completedAt);
            const key = timer.completedAt ?? `${timer.duration}-${index}`;

            return (
              <li key={key} className="past-timers-item">
                <span className="past-timers-duration">
                  {formatDuration(timer.duration)}
                </span>

                {completedDate && (
                  <time
                    className="past-timers-time"
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
    </section>
  );
}
