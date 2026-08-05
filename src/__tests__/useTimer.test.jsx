//File name: useTimer.test.jsx
//Author: Kyle McColgan
//Date: 4 August 2026
//Description: This file contains the Vitest unit test suite for the timer React project useTimer hook.

import React from "react";
import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer, DEFAULT_DURATION } from "../hooks/useTimer.js";

describe("useTimer hook", () => {
    beforeEach(() => {
        localStorage.clear(); //Clear timers before each test.
        vi.useFakeTimers();

        //1. Tell Vitest to automatically mock and increment performance.now().
        vi.spyOn(global.performance, "now").mockImplementation(() => {
            return vi.getMockedSystemTime().getTime();
        });

        vi.spyOn(global.Date, "now").mockImplementation(() => {
            return vi.getMockedSystemTime().getTime();
        });

        //2. Map requestAnimationFrame directly to Vitest's virtual timer clock.
        vi.stubGlobal("requestAnimationFrame", (cb) => {
            return setTimeout(() => {
                //Pass the current virtual system time directly to the callback.
                cb(vi.getMockedSystemTime().getTime());
            }, 16);
        });

        vi.stubGlobal("cancelAnimationFrame", (id) => {
            clearTimeout(id);
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
        vi.unstubAllGlobals(); //Cleans up the stubGlobal overrides automatically.
    });

    //Utility to flush the RAF loop while allowing React state to update.
    const flushUntil = async (condition, maxFrames = 1500) => {
        let frames = 0;

        while ((!condition()) && (frames < maxFrames))
        {
            //Steps the clock by 16ms and flushes the React fiber state immediately.
            await act(async () => {
                await vi.advanceTimersByTimeAsync(16);
            });
            frames++;
        }

        if (frames >= maxFrames)
        {
            throw new Error(`flushUtil exceed maxFrames (${maxFrames}) without meeting condition!`);
        }
    };

    //Test #1
    test("1. initalizes with default values", () => {
        const { result } = renderHook(() => useTimer());

        expect(result.current.duration).toBe(DEFAULT_DURATION);
        expect(result.current.timeLeft).toBe(DEFAULT_DURATION);
        expect(result.current.running).toBe(false);
        expect(result.current.pastTimers).toEqual([]);
    });

    //Test #2
    test("2. hydrates pastTimers from localStorage", () => {
        const stored = [{ duration: 1000, completedAt: 123 }];
        localStorage.setItem("pastTimers", JSON.stringify(stored));

        const { result } = renderHook(() => useTimer());

        expect(result.current.pastTimers).toEqual(stored);
    });

    //Test #3
    test("3. starts the timer", () => {
        const { result } = renderHook(() => useTimer());

        act(() => result.current.start());

        expect(result.current.running).toBe(true);
    });

    //Test #4
    test("4. pauses the timer", () => {
        const { result } = renderHook(() => useTimer());

        act(() => {
            result.current.start();
            result.current.pause();
        });

        expect(result.current.running).toBe(false);
    });

    //Test #5
    test("5. counts down over time", async () => {
        const { result } = renderHook(() => useTimer());

        //Process default hydration effects.
        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });

        //2. Now start() will change running state.
        act(() => {
            result.current.start();
        });

        await flushUntil(() => result.current.timeLeft < DEFAULT_DURATION);

        expect(result.current.timeLeft).toBeLessThan(DEFAULT_DURATION);
    });

    //Test #6
    test("6. stops at zero", async () => {
        const { result } = renderHook(() => useTimer());

        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });
        act(() => result.current.start());

        await flushUntil(() => !result.current.running);

        expect(result.current.timeLeft).toBe(0);
        expect(result.current.running).toBe(false);
    });

    //Test #7
    test("7. adds completed timer to pastTimers", async () => {
        const { result } = renderHook(() => useTimer());

        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });
        act(() => result.current.start());
        await flushUntil(() => !result.current.running);

        expect(result.current.pastTimers.length).toBe(1);
        expect(result.current.pastTimers[0].duration).toBe(DEFAULT_DURATION);
    });

    //Test #8
    test("8. writes completed timer to localStorage", async () => {
        const spy = vi.spyOn(Storage.prototype, "setItem");
        const { result } = renderHook(() => useTimer());
        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });

        act(() => result.current.start());
        await flushUntil(() => !result.current.running);
        expect(spy).toHaveBeenCalledWith(
            "timerSession",
            expect.any(String)
        );
    });

    //Test #9
    test("9. resets to original duration", async () => {
        const { result } = renderHook(() => useTimer());

        //Process default hydration effects first.
        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });

        act(() => {
            result.current.start();
        });

        act(() => {
            vi.advanceTimersByTime(2000);
            result.current.reset();
        });

        expect(result.current.timeLeft).toBe(DEFAULT_DURATION);
        expect(result.current.running).toBe(false);
    });

    //Test #10
    test("10. clears past timers", async () => {
        const { result } = renderHook(() => useTimer());

        //Process default hydration effects first.
        await act(async () => {
            await vi.advanceTimersByTimeAsync(0);
        });

        act(() => result.current.start());
        await flushUntil(() => !result.current.running);

        act(() => {
            result.current.clearPastTimers();
        });

        expect(result.current.pastTimers).toEqual([]);
        expect(localStorage.getItem("pastTimers")).toBeNull();
    });
});
