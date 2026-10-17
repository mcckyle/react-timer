//File name: useTimer.js
//Author: Kyle McColgan
//Date: 17 October 2026
//Description: This file contains the custom timekeeping hook for the timer React project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).
const STORAGE_KEY = "pastTimers";
const TIMER_SESSION_KEY = "timerSession";
const MAX_HISTORY = 50;

//Clock Helpers.
const nowPerf = () =>
{
    return typeof performance !== "undefined"
      ? performance.now()
      : Date.now()
};
const nowEpoch = () => Date.now();

//Animation Frame Helpers.
const requestRAF =
    typeof requestAnimationFrame !== "undefined"
      ? requestAnimationFrame
      : (callback) => setTimeout(callback, 16);

const cancelRAF =
    typeof cancelAnimationFrame !== "undefined"
      ? cancelAnimationFrame
      : (id) => clearTimeout(id);

//Storage Helpers.
function safeParse(value)
{
    if (!value)
    {
        return null;
    }

    try
    {
        return JSON.parse(value);
    }
    catch
    {
        return null;
    }
}

function readStorage(key)
{
    try
    {
        return localStorage.getItem(key);
    }
    catch
    {
        //Storage may be unavailable or restricted...
        return null;
    }
}

function writeStorage(key, value)
{
    try
    {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch
    {
        //Storage may be unavailable or restricted...
    }
}

function removeStorage(key)
{
    try
    {
        localStorage.removeItem(key);
    }
    catch
    {
        //Storage may be unavailable or restricted...
    }
}

function readTimerSession()
{
    return safeParse(readStorage(TIMER_SESSION_KEY));
}
function persistTimerSession(payload)
{
    writeStorage(TIMER_SESSION_KEY, payload);
}
function clearTimerSession()
{
    removeStorage(TIMER_SESSION_KEY);
}

export function useTimer()
{
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION); //Time in milliseconds.

    //Full resolution time for smooth visual effects.
    //The visible timer remains second-oriented.
    const [visualTimeLeft, setVisualTimeLeft] = useState(DEFAULT_DURATION);
    const [running, setRunning] = useState(false);
    const [pastTimers, setPastTimers] = useState([]);
    const [hydrated, setHydrated] = useState(false);

    const rafRef = useRef(null);
    const startRef = useRef(null);
    const completedRef = useRef(false);
    const lastSecondRef = useRef(null);

    //Prevents unintended persistence during initial hydration, completion, and reset.
    const skipPersistRef = useRef(true);

    //Hydrate past timers once...
    useEffect(() =>
    {
        const parsed = safeParse(readStorage(STORAGE_KEY));

        if (Array.isArray(parsed))
        {
            setPastTimers(parsed.slice(0, MAX_HISTORY));
        }
    }, []);

    //Complete a timer exactly once.
    const complete = useCallback((completedDuration) =>
    {
        if (completedRef.current)
        {
            return; //Prevents double-completion.
        }

        completedRef.current = true;
        skipPersistRef.current = true;

        if (rafRef.current !== null)
        {
            cancelRAF(rafRef.current);
            rafRef.current = null;
        }

        startRef.current = null;
        lastSecondRef.current = null;

        setVisualTimeLeft(0);
        setTimeLeft(0);
        setRunning(false);
        clearTimerSession();

        const entry = {
            duration: completedDuration,
            completedAt: nowEpoch(),
        };

        setPastTimers((previous) =>
        {
            const next = [entry, ...previous].slice(0, MAX_HISTORY);

            writeStorage(STORAGE_KEY, next);

            return next;
        });
    }, []);

    //Restore previous timer session (if one exists).
    useEffect(() =>
    {
        const session = readTimerSession();

        //No saved sessions...
        if (!session)
        {
            setHydrated(true);
            return;
        }

        const {
            duration: storedDuration,
            timeLeft: storedTimeLeft,
            running: storedRunning,
            startEpoch,
        } = session;

        const validSession = (Number.isFinite(storedDuration)) && (storedDuration > 0) && (Number.isFinite(storedTimeLeft)) && (storedTimeLeft >= 0) && (typeof storedRunning === "boolean");

        if (!validSession)
        {
            clearTimerSession();
            setHydrated(true);
            return;
        }

        setDuration(storedDuration);

        //Restore a paused session.
        if (!storedRunning)
        {
            const remaining = Math.min(storedDuration, storedTimeLeft);
            setTimeLeft(remaining);
            setVisualTimeLeft(remaining);
            setRunning(false);
            setHydrated(true);
            return;
        }

        //A running session requires a valid wall-clock start time.
        if (!Number.isFinite(startEpoch))
        {
            clearTimerSession();
            setHydrated(true);
            return;
        }

        const elapsed = Math.max(0, nowEpoch() - startEpoch);
        const remaining = Math.max(0, storedDuration - elapsed);

        if (remaining <= 0)
        {
            setHydrated(true);
            complete(storedDuration);
            return;
        }

        //Re-establish the monotonic clock from the restored elapsed time.
        startRef.current = nowPerf() - elapsed;
        lastSecondRef.current = null;

        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);
        setRunning(true);
        setHydrated(true);
    }, [complete]);

    //Persist paused sessions only after hydration.
    useEffect(() =>
    {
        //Never persist during the initial hydration render.
        if (!hydrated)
        {
            return;
        }

        //Completion and reset intentionally clear the session.
        if (skipPersistRef.current)
        {
            skipPersistRef.current = false;
            return;
        }

        //Running sessions are persisted explicitly by start().
        if (running)
        {
            return;
        }

        persistTimerSession({ duration, timeLeft, running: false, });
    }, [hydrated, duration, timeLeft, running]);

    //Animation-frame loop.
    const tick = useCallback(() =>
    {
        if ((!running) || (startRef.current === null))
        {
            return;
        }

        const elapsed = nowPerf() - startRef.current;
        const remaining = Math.max(0, duration - elapsed);

        //Keep visual effects smooth without tying their resolution
        //to the visible timer's displayed seconds.
        setVisualTimeLeft(remaining);

        if (remaining <= 0)
        {
            complete(duration);
            return;
        }

        //The visible timer only updates when the displayed
        //second changes. This prevents unnecessary React
        //renders while preserving a perfectly smooth
        //visual animation...
        const nextSecond = Math.ceil(remaining / 1000);

        //Update the visible timer only when its displayed second changes.
        if (lastSecondRef.current !== nextSecond)
        {
            lastSecondRef.current = nextSecond;
            setTimeLeft(remaining);
        }

        rafRef.current = requestRAF(tick);
    }, [duration, running, complete]);

    //Start and clean up the animation-frame loop.
    useEffect(() =>
    {
        if (!running)
        {
            return undefined;
        }

        rafRef.current = requestRAF(tick);

        return () =>
        {
            if (rafRef.current !== null)
            {
                cancelRAF(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [running, tick]);

    //Handle start timer button click.
    const start = useCallback(() =>
    {
        //A completed timer remains at zero until the user
        //explicitly resets it. Starting from zero restores
        //the selected duration without immediately beginning
        //another run.
        if ((timeLeft <= 0) || (!Number.isFinite(duration)) || (duration <= 0))
        {
            return; //Exit early to force the user to reset first.
        }

        const remaining = Math.min(duration, Math.max(0, timeLeft));

        if (remaining <= 0)
        {
            return;
        }

        completedRef.current = false; //Reset for a fresh run.
        skipPersistRef.current = false;

        const elapsed = duration - remaining;
        const currentPerf = nowPerf();
        const currentEpoch = nowEpoch();

        startRef.current = currentPerf - elapsed;
        lastSecondRef.current = null; //Force first frame update.

        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);
        persistTimerSession({ duration, timeLeft: remaining, running: true, startEpoch: currentEpoch - elapsed, });
        setRunning(true);
    }, [duration, timeLeft]);

    //Pause the timer at its precise current position.
    const pause = useCallback(() =>
    {
        if (!running)
        {
            return;
        }

        //Capture the exact timer position before changing
        //React state so persistence never receives stale `timeLeft`.
        const elapsed = startRef.current === null ? 0 : nowPerf() - startRef.current;
        const remaining = Math.max(0, duration - elapsed);

        if (rafRef.current !== null)
        {
            cancelRAF(rafRef.current);
            rafRef.current = null;
        }

        startRef.current = null;
        lastSecondRef.current = null;
        skipPersistRef.current = false;
        setRunning(false);
        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);

        persistTimerSession({ duration, timeLeft: remaining, running: false, });
    }, [duration, running]);

    //Reset to the currently selected duration.
    const reset = useCallback(() =>
    {
        if (rafRef.current !== null)
        {
            cancelRAF(rafRef.current);
            rafRef.current = null;
        }

        completedRef.current = false;
        startRef.current = null;
        lastSecondRef.current = null;
        skipPersistRef.current = true;

        setRunning(false);
        setTimeLeft(duration);
        setVisualTimeLeft(duration);
        clearTimerSession();
    }, [duration]);

    //Clear saved timer history.
    const clearPastTimers = useCallback(() =>
    {
        setPastTimers([]);
        removeStorage(STORAGE_KEY);
    }, []);

    return {
        duration,
        setDuration,
        timeLeft,
        visualTimeLeft, //Full-resolution timer state for AmbientBackground.
        setTimeLeft,
        running,
        start,
        pause,
        reset,
        pastTimers,
        clearPastTimers,
    };
}
