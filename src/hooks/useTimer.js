//File name: useTimer.js
//Author: Kyle McColgan
//Date: 12 May 2026
//Description: This file contains the custom timekeeping hook for the timer React project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).
const STORAGE_KEY = "pastTimers";
const TIMER_SESSION_KEY = "timerSession";
const MAX_HISTORY = 50;

const requestRAF =
  typeof requestAnimationFrame !== "undefined"
    ? requestAnimationFrame
    : (cb) => setTimeout(cb, 16);

const cancelRAF =
  typeof cancelAnimationFrame !== "undefined"
    ? cancelAnimationFrame
    : (id) => clearTimeout(id);

//Bridge: convert performance.now() <-> Date.now().
const nowPerf = () => performance.now();
const nowEpoch = () => Date.now();

function safeParse(value)
{
    try
    {
        return JSON.parse(value);
    }
    catch
    {
        return null;
    }
}

function persistTimerSession(payload)
{
    try
    {
        localStorage.setItem(TIMER_SESSION_KEY, JSON.stringify(payload));
    }
    catch
    {
        /* Silent storage failures... */
    }
}

function clearTimerSession()
{
    localStorage.removeItem(TIMER_SESSION_KEY);
}

export function useTimer()
{
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION); //Time in milliseconds.
    const [running, setRunning] = useState(false);
    const [pastTimers, setPastTimers] = useState([]);

    const rafRef = useRef(null);
    const startRef = useRef(null);
    const completedRef = useRef(false);
    const lastSecondRef = useRef(null);

    const hydratedRef = useRef(false);
    const restoringRef = useRef(true);

    //Hydrate past timers once...
    useEffect(() =>
    {
        const parsed = safeParse(localStorage.getItem(STORAGE_KEY));

        if (Array.isArray(parsed))
        {
            setPastTimers(parsed.slice(0, MAX_HISTORY));
        }
    }, []);

    //Persist non-running timer state.
    useEffect(() =>
    {
        if ( (restoringRef.current) || (!hydratedRef.current) || (running))
        {
            return;
        }

        persistTimerSession({ duration, timeLeft, running: false, });
    }, [duration, timeLeft, running]);

    const complete = useCallback((completedDuration = duration) =>
    {
        if (completedRef.current)
        {
            return; //Prevents double-completion.
        }

        completedRef.current = true;

        if (rafRef.current)
        {
            cancelRAF(rafRef.current);
            rafRef.current = null;
        }

        setRunning(false);
        clearTimerSession();

        const entry = {
            duration: completedDuration,
            completedAt: nowEpoch(),
        };

        setPastTimers((prev) =>
        {
            const next = [entry, ...prev].slice(0, MAX_HISTORY);

            //Avoid unnecessary writes.
            if ( (JSON.stringify(prev)) !== (JSON.stringify(next)))
            {
                try
                {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                } catch { /* silent storage failure. */ }
            }

            return next;
        });
    }, [duration]);

    //Restore previous timer session (if one exists).
    useEffect(() =>
    {
        const parsed = safeParse(localStorage.getItem(TIMER_SESSION_KEY));

        if (!parsed)
        {
            hydratedRef.current = true;
            return;
        }

        const {
            duration: storedDuration,
            timeLeft: storedTimeLeft,
            running: storedRunning,
            startEpoch,
        } = parsed;

        if ((typeof storedDuration !== "number") || (typeof storedTimeLeft !== "number"))
        {
            return;
        }

        setDuration(storedDuration);

        //Paused persistence.
        if (!storedRunning)
        {
            setTimeLeft(storedTimeLeft);
            setRunning(false);
            return;
        }

        //Running persistence.
        if (typeof startEpoch !== "number")
        {
            return;
        }

        const now = nowEpoch();
        const elapsed = now - startEpoch;
        const remaining = storedDuration - elapsed;

        if (remaining <= 0)
        {
            complete(storedDuration);
            return;
        }

        startRef.current = nowPerf() - elapsed;
        setTimeLeft(remaining);
        setRunning(true);
    }, [complete]);

    //Unlock persistence after restoration finishes.
    useEffect(() =>
    {
        if ((!hydratedRef.current))
        {
            hydratedRef.current = true;
            return;
        }

        restoringRef.current = false;
    }, [running, timeLeft, duration]);

    //RAF Loop (peformance.now()).
    const tick = useCallback(() =>
    {
        if ((!running) || (startRef.current == null))
        {
            return;
        }

        const now = nowPerf();
        const elapsed = now - startRef.current;
        const remaining = Math.max(0, duration - elapsed);

        if (remaining <= 0)
        {
            setTimeLeft(0);
            complete();
            return;
        }

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
            return;
        }

        rafRef.current = requestRAF(tick);

        return () =>
        {
            if (rafRef.current)
            {
                cancelRAF(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [running, tick]);

    //Handle start timer button click.
    const start = useCallback(() =>
    {
        //Only reset if we are starting a brand-new timer.
        if (timeLeft <= 0)
        {
            //Do not reset completedRef yet, require explicit reset.
            setTimeLeft(duration);
            return; //Exit early to force the user to reset first.
        }

        completedRef.current = false; //Reset for a fresh run.
        const nowP = nowPerf();
        const nowE = nowEpoch();
        const elapsed = duration - timeLeft;

        startRef.current = nowP - elapsed;
        lastSecondRef.current = null; //Force first frame update.

        try
        {
            persistTimerSession({ duration, timeLeft, running: true, startEpoch: nowE - elapsed, });
        }
        catch {}

        setRunning(true);
    }, [duration, timeLeft]);

    const pause = useCallback(() =>
    {
        setRunning(false);

        if (rafRef.current)
        {
            cancelRAF(rafRef.current);
            rafRef.current = null;
        }

        persistTimerSession({ duration, timeLeft, running: false, });

        const now = nowPerf();
        const elapsed = duration - timeLeft;

        //Accurate resume position.
        startRef.current = now - elapsed;
    }, [duration, timeLeft]);

    const reset = useCallback(() =>
    {
        if (rafRef.current)
        {
            cancelRAF(rafRef.current);
            rafRef.current = null;
        }

        completedRef.current = false;
        startRef.current = null;
        lastSecondRef.current = null;

        setRunning(false);
        setTimeLeft(duration);
        clearTimerSession();
    }, [duration]);

    const clearPastTimers = useCallback(() =>
    {
        setPastTimers([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    return {
        duration,
        setDuration,
        timeLeft,
        setTimeLeft,
        running,
        start,
        pause,
        reset,
        pastTimers,
        clearPastTimers,
    };
}
