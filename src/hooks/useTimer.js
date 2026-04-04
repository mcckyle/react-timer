//File name: useTimer.js
//Author: Kyle McColgan
//Date: 3 April 2026
//Description: This file contains the custom timekeeping hook for the timer React project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).
const STORAGE_KEY = "pastTimers";
const RUNNING_TIMER_KEY = "runningTimer";
const MAX_HISTORY = 50;

const requestRAF =
  typeof requestAnimationFrame !== "undefined"
    ? requestAnimationFrame
    : (cb) => setTimeout(cb, 16);

const cancelRAF =
  typeof cancelAnimationFrame !== "undefined"
    ? cancelAnimationFrame
    : (id) => clearTimeout(id);

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

    //Hydrate past timers once...
    useEffect(() =>
    {
        const parsed = safeParse(localStorage.getItem(STORAGE_KEY));

        if (Array.isArray(parsed))
        {
            setPastTimers(parsed.slice(0, MAX_HISTORY));
        }
    }, []);

    //Restore running timer (if one exists).
    useEffect(() =>
    {
        const parsed = safeParse(localStorage.getItem(RUNNING_TIMER_KEY));

        if ((!parsed) || (typeof parsed.start !== "number") || (typeof parsed.duration !== "number"))
        {
            return;
        }

        const elapsed = Date.now() - parsed.start;
        const remaining = parsed.duration - elapsed;

        if (remaining <= 0)
        {
            complete(parsed.duration);
            return;
        }

        startRef.current = parsed.start;
        setDuration(parsed.duration);
        setTimeLeft(remaining);
        setRunning(true);
    }, []);

    const complete = useCallback((completedDuration = duration) =>
    {
        const finalDuration = completedDuration ?? duration;

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
        localStorage.removeItem(RUNNING_TIMER_KEY);

        const entry = {
            duration: finalDuration,
            completedAt: Date.now(),
        };

        setPastTimers((prev) =>
        {
            const next = [entry, ...prev].slice(0, MAX_HISTORY);

            if (JSON.stringify(prev) !== JSON.stringify(next))
            {
                try
                {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
                } catch { /* silent storage failure. */ }
            }

            return next;
        });
    }, [duration]);

    //Animation Frame Loop.
    const tick = useCallback(() =>
    {
        if ( (!startRef.current) || (!running) )
        {
            return;
        }

        const elapsed = Date.now() - startRef.current;
        const remaining = Math.max(0, duration - elapsed);

        if ( (remaining <= 0) && (!completedRef.current) )
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
            }
            rafRef.current = null;
        };
    }, [running, tick]);

    //Handle start timer button click.
    const start = useCallback(() =>
    {
        //Only reset if we are starting a brand-new timer.
        if (timeLeft <= 0)
        {
            //Do noit reset completedRef yet, require explicit reset.
            setTimeLeft(duration);
            return; //Exit early to force the user to reset first.
            //completedRef.current = false;
        }

        completedRef.current = false; //Reset for a fresh run.
        const startTime = Date.now() - (duration - timeLeft);
        startRef.current = startTime;
        lastSecondRef.current = null; //Force first frame update.

        try
        {
            localStorage.setItem(RUNNING_TIMER_KEY, JSON.stringify({ start: startTime, duration }));
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
        }

        rafRef.current = null;

        localStorage.removeItem(RUNNING_TIMER_KEY);

        //Preserve position.
        startRef.current = Date.now() - (duration - timeLeft);
    }, [duration, timeLeft]);

    const reset = useCallback(() =>
    {
        if (rafRef.current)
        {
            cancelRAF(rafRef.current);
        }

        rafRef.current = null;
        completedRef.current = false;
        startRef.current = null;
        lastSecondRef.current = null;

        setRunning(false);
        setTimeLeft((prev) => (prev !== duration ? duration : prev));
        localStorage.removeItem(RUNNING_TIMER_KEY);
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
