//File name: useTimer.js
//Author: Kyle McColgan
//Date: 13 March 2026
//Description: This file contains the custom timekeeping hook for the timer React project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).
const STORAGE_KEY = "pastTimers";
const RUNNING_TIMER_KEY = "runningTimer";
const MAX_HISTORY = 50;

export function useTimer()
{
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION); //Time in milliseconds.
    const [running, setRunning] = useState(false);
    const [pastTimers, setPastTimers] = useState([]);

    const rafRef = useRef(null);
    const startTimestampRef = useRef(null);
    const completedRef = useRef(false);
    const lastSecondRef = useRef(null);
    const timeLeftRef = useRef(timeLeft);

    useEffect(() => {
        timeLeftRef.current = timeLeft;
    }, [timeLeft]);

    const cancelRAF = typeof cancelAnimationFrame !== "undefined"
      ? cancelAnimationFrame
      : () => {};

    const requestRAF = typeof requestAnimationFrame !== "undefined"
      ? requestAnimationFrame
      : (cb) => setTimeout(cb, 16);

    //Hydrate past timers once...
    useEffect(() => {
        try
        {
            const stored = localStorage.getItem(STORAGE_KEY);
            const parsed = stored ? JSON.parse(stored) : null;

            if (Array.isArray(parsed))
            {
                setPastTimers(parsed.slice(0, MAX_HISTORY));
            }
        } catch { /* silent fail (corrupt storage). */ }
    }, []);

    //Restore running timer (if one exists).
    useEffect(() => {
        try
        {
            const stored = localStorage.getItem(RUNNING_TIMER_KEY);

            if (!stored)
            {
                return;
            }

            const parsed = JSON.parse(stored);

            if ( (!parsed?.start) || (!parsed?.duration))
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

            startTimestampRef.current = parsed.start;
            setDuration(parsed.duration);
            setTimeLeft(remaining);
            setRunning(true);
        }
        catch {}
    }, []);

    const complete = useCallback((completedDuration = duration) => {
        if (completedRef.current)
        {
            return; //Prevents double-completion.
        }

        completedRef.current = true;
        cancelRAF(rafRef.current)
        rafRef.current = null;
        setRunning(false);
        localStorage.removeItem(RUNNING_TIMER_KEY);

        const completedTimer = {
            duration: completedDuration,
            completedAt: Date.now(),
        };

        setPastTimers((prev) => {
            const updated = [completedTimer, ...prev].slice(0, MAX_HISTORY);
            try
            {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch { /* silent storage failure. */ }

            return updated;
        });
    }, [duration]);

    //Animation Frame Loop.
    const tick = useCallback(() => {
        if (!startTimestampRef.current)
        {
            return;
        }

        const elapsed = Date.now() - startTimestampRef.current;
        const remaining = duration - elapsed;

        if (remaining <= 0)
        {
            setTimeLeft(0);
            complete();
            return;
        }

        const currentSecond = Math.ceil(remaining / 1000);

        if ( (lastSecondRef.current !== currentSecond) || (timeLeftRef.current === duration) )
        {
            lastSecondRef.current = currentSecond;
            setTimeLeft(remaining);
        }

        rafRef.current = requestRAF(() => tick());
    }, [duration, complete]);

    useEffect(() => {
        if (!running)
        {
            return;
        }

        rafRef.current = requestRAF(tick);

        return () => {
            if (rafRef.current != null)
            {
                cancelRAF(rafRef.current);
            }
        };
    }, [running, tick]);

    const start = useCallback(() => {
        completedRef.current = false; //Reset for a new run.
        const startTime = Date.now() - (duration - timeLeft);
        startTimestampRef.current = startTime;
        lastSecondRef.current = Math.ceil(timeLeft / 1000);

        try
        {
            localStorage.setItem(RUNNING_TIMER_KEY, JSON.stringify({ start: startTime, duration }));
        }
        catch {}

        setRunning(true);
    }, [duration, timeLeft]);

    const pause = useCallback(() => {
        setRunning(false);
        cancelAnimationFrame(rafRef.current);

        try
        {
            localStorage.removeItem(RUNNING_TIMER_KEY);
        }
        catch {}

        startTimestampRef.current = Date.now() - (duration - timeLeft);
    }, [duration, timeLeft]);

    const reset = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        completedRef.current = false;
        startTimestampRef.current = null;
        setRunning(false);
        setTimeLeft(duration);

        try
        {
            localStorage.removeItem(RUNNING_TIMER_KEY);
        }
        catch {}
    }, [duration]);

    const clearPastTimers = useCallback(() => {
        setPastTimers([]);
        try
        {
            localStorage.removeItem(STORAGE_KEY);
        } catch { /* Silent. */ }
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
