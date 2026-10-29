//File name: useTimer.js
//Author: Kyle McColgan
//Date: 29 October 2026
//Description: This file contains the custom timekeeping hook for the timer React project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).
const STORAGE_KEY = "pastTimers";
const TIMER_SESSION_KEY = "timerSession";
const MAX_HISTORY = 50;

//Clock Helpers.
const nowPerf = () =>
  typeof performance !== "undefined" ? performance.now() : Date.now();
const nowEpoch = () => Date.now();

//Animation-frame Helpers.
const requestRAF =
    typeof requestAnimationFrame !== "undefined"
      ? requestAnimationFrame
      : (callback) => setTimeout(() => callback(nowPerf()), 16);

const cancelRAF =
    typeof cancelAnimationFrame !== "undefined"
      ? cancelAnimationFrame
      : clearTimeout;

//Storage Helpers.
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
function readTimerSession()
{
    return safeParse(readStorage(TIMER_SESSION_KEY));
}
function persistTimerSession(session)
{
    writeStorage(TIMER_SESSION_KEY, session);
}
function clearTimerSession()
{
    removeStorage(TIMER_SESSION_KEY);
}

function cancelScheduledFrame(frameRef)
{
    if (frameRef.current === null)
    {
        return;
    }

    cancelRAF(frameRef.current);
    frameRef.current = null;
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

    //Load timer history.
    useEffect(() =>
    {
        const history = safeParse(readStorage(STORAGE_KEY));

        if (Array.isArray(history))
        {
            setPastTimers(history.slice(0, MAX_HISTORY));
        }
    }, []);

    //Cancel any pending animation frame.
    const cancelFrame = useCallback(() => {
        cancelScheduledFrame(rafRef);
    }, []);

    //Complete the current timer once.
    const complete = useCallback((completedDuration) =>
    {
        if (completedRef.current)
        {
            return; //Prevents double-completion.
        }

        completedRef.current = true;
        skipPersistRef.current = true;

        cancelFrame();
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
    }, [cancelFrame]);

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

        const validSession =
          (Number.isFinite(storedDuration)) &&
          (storedDuration > 0) &&
          (Number.isFinite(storedTimeLeft)) &&
          (storedTimeLeft >= 0) &&
          (typeof storedRunning === "boolean");

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
        setHydrated(true);

        if (remaining <= 0)
        {
            complete(storedDuration);
            return;
        }

        //Re-establish the monotonic clock from the restored elapsed time.
        startRef.current = nowPerf() - elapsed;
        lastSecondRef.current = null;

        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);
        setRunning(true);
    }, [complete]);

    //Persist paused sessions after hydration.
    useEffect(() =>
    {
        //Never persist during the initial hydration render.
        if ((!hydrated) || (skipPersistRef.current) || (running))
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

        return cancelFrame;
    }, [running, tick, cancelFrame]);

    //Start or resume the countdown.
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

        const remaining = Math.min(duration, timeLeft);
        const elapsed = duration - remaining;

        completedRef.current = false; //Reset for a fresh run.
        skipPersistRef.current = false;
        startRef.current = nowPerf() - elapsed;
        lastSecondRef.current = null; //Force first frame update.

        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);
        persistTimerSession({ duration, timeLeft: remaining, running: true, startEpoch: nowEpoch() - elapsed, });
        setRunning(true);
    }, [duration, timeLeft]);

    //Pause the timer at the precise current position.
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

        cancelFrame();

        startRef.current = null;
        lastSecondRef.current = null;
        skipPersistRef.current = false;
        setRunning(false);
        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);

        persistTimerSession({ duration, timeLeft: remaining, running: false, });
    }, [running, duration, cancelFrame]);

    //Reset to the selected duration.
    const reset = useCallback(() =>
    {
        cancelFrame();

        completedRef.current = false;
        startRef.current = null;
        lastSecondRef.current = null;
        skipPersistRef.current = true;

        setRunning(false);
        setTimeLeft(duration);
        setVisualTimeLeft(duration);
        clearTimerSession();
    }, [duration, cancelFrame]);

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
