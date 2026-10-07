//File name: useTimer.js
//Author: Kyle McColgan
//Date: 7 October 2026
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
const nowEpoch = () =>
{
    return Date.now();
};

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
        /* Storage may be unavailable or restricted... */
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
        /* Storage may be unavailable or restricted... */
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

    //Full resolution timer state used exclusively by
    //visual systems such as the ambient nebula.
    //`timeLeft` intentionally remains second-oriented
    //for the visible timer display.
    const [visualTimeLeft, setVisualTimeLeft] = useState(DEFAULT_DURATION);
    const [running, setRunning] = useState(false);
    const [pastTimers, setPastTimers] = useState([]);

    const rafRef = useRef(null);
    const startRef = useRef(null);
    const completedRef = useRef(false);
    const lastSecondRef = useRef(null);

    //React state is used for hydration so the persistence
    //effect cannot write until the restored state
    //has actually rendered.
    const [hydrated, setHydrated] = useState(false);

    //Prevents the persistence effect from writing a fresh
    //session immediately after resets.
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

        if ((typeof storedDuration !== "number") || (!Number.isFinite(storedDuration)) || (storedDuration <= 0) || (typeof storedTimeLeft !== "number") || (!Number.isFinite(storedTimeLeft)) || (storedTimeLeft < 0))
        {
            clearTimerSession();
            setHydrated(true);
            return;
        }

        setDuration(storedDuration);

        //Paused persistence.
        if (!storedRunning)
        {
            setTimeLeft(storedTimeLeft);
            setVisualTimeLeft(storedTimeLeft);
            setRunning(false);

            setHydrated(true);
            return;
        }

        //Running persistence.
        if ((typeof startEpoch !== "number") || (!Number.isFinite(startEpoch)))
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

        startRef.current = nowPerf() - elapsed;
        lastSecondRef.current = null;
        setTimeLeft(remaining);
        setVisualTimeLeft(remaining);
        setRunning(true);
        setHydrated(true);
    }, [complete]);

    //Persist paused timer state.
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

    //RAF Loop (peformance.now()).
    const tick = useCallback(() =>
    {
        if ((!running) || (startRef.current === null))
        {
            return;
        }

        const elapsed = nowPerf() - startRef.current;
        const remaining = Math.max(0, duration - elapsed);

        //Visual systems receive the complete millisecond
        //resolution on every animation frame.
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

        //Always update on first frame OR when second changes.
        if (lastSecondRef.current !== nextSecond)
        {
            lastSecondRef.current = nextSecond;
            setTimeLeft(remaining);
        }

        rafRef.current = requestRAF(tick);
    }, [duration, running, complete]);

    //Run loop control.
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
        if (timeLeft <= 0)
        {
            //Do not reset completedRef yet, require explicit reset.
            setTimeLeft(duration);
            setVisualTimeLeft(duration);
            return; //Exit early to force the user to reset first.
        }

        completedRef.current = false; //Reset for a fresh run.
        skipPersistRef.current = false;

        const elapsed = Math.max(0, duration - timeLeft);
        const currentPerf = nowPerf();
        const currentEpoch = nowEpoch();
        const remaining = Math.max(0, duration - elapsed);

        startRef.current = currentPerf - elapsed;
        lastSecondRef.current = null; //Force first frame update.

        setVisualTimeLeft(remaining);

        persistTimerSession({ duration, timeLeft: remaining, running: true, startEpoch: currentEpoch - elapsed, });

        setRunning(true);
    }, [duration, timeLeft]);

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
        setVisualTimeLeft(remaining);
        setTimeLeft(remaining);
        persistTimerSession({ duration, timeLeft: remaining, running: false, });
    }, [duration, running]);

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

        //Tell the persistence effect that this state
        //was intentionally cleared rather than naturally paused.
        skipPersistRef.current = true;

        setRunning(false);
        setTimeLeft(duration);
        setVisualTimeLeft(duration);
        clearTimerSession();
    }, [duration]);

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
