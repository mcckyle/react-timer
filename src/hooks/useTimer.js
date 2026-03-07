//File name: useTimer.js
//Author: Kyle McColgan
//Date: 6 March 2026
//Description: This file contains the custom timekeeping hook for the timer React project.

import { useEffect, useState, useRef, useCallback } from "react";

export const DEFAULT_DURATION = 10 * 1000; //10 seconds (milliseconds).
const STORAGE_KEY = "pastTimers";
const MAX_HISTORY = 50;

export function useTimer()
{
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [timeLeft, setTimeLeft] = useState(DEFAULT_DURATION); //Time in milliseconds.
    const [running, setRunning] = useState(false);
    const [pastTimers, setPastTimers] = useState([]);

    const intervalRef = useRef(null);
    const lastTickRef = useRef(0);
    const completedRef = useRef(false);

    //Hydrate past timers once...
    useEffect(() => {
        try
        {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored)
            {
                const parsed = JSON.parse(stored);

                if (Array.isArray(parsed))
                {
                    setPastTimers(JSON.parse(stored));
                }
            }
        } catch { /* silent. */ }
    }, []);

    const stopInterval = useCallback(() => {
        if ( ! intervalRef.current)
        {
            return;
        }

        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);

    const complete = useCallback(() => {
        if (completedRef.current)
        {
            return; //Prevents double-completion.
        }

        completedRef.current = true;
        stopInterval();
        setRunning(false);

        const completedTimer = {
            duration,
            completedAt: Date.now(),
        };

        setPastTimers((prev) => {
            const updated = [completedTimer, ...prev].slice(0, MAX_HISTORY);
            try
            {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            } catch { /* silent. */ }
            return updated;
        });
    }, [duration, stopInterval]);

    //Countdown loop.
    useEffect(() => {
        if ( ! running)
        {
            stopInterval();
            return;
        }

        lastTickRef.current = Date.now();

        if (intervalRef.current)
        {
            return;
        }

        intervalRef.current = setInterval(() => {
            const now = Date.now();
            const delta = now - lastTickRef.current;
            lastTickRef.current = now;

            setTimeLeft((prev) => {
                const next = prev - delta;

                if (next <= 0)
                {
                    complete();
                    return 0;
                }

                return next;
            });
        }, 50);

        return stopInterval;
    }, [running, complete, stopInterval]);

    const start = useCallback(() => {
        completedRef.current = false; //Reset for a new run.
        setTimeLeft((prev) => (prev <= 0 ? duration : prev));
        setRunning(true);
    }, [duration]);

    const pause = useCallback(() => {
        setRunning(false);
    }, []);

    const reset = useCallback(() => {
        stopInterval();
        completedRef.current = false;
        setRunning(false);
        setTimeLeft(duration);
    }, [duration, stopInterval]);

    const clearPastTimers = useCallback(() => {
        setPastTimers([]);
        try
        {
            localStorage.removeItem(STORAGE_KEY);
        } catch { /* silent. */ }
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
