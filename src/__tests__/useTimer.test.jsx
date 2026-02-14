//File name: useTimer.test.jsx
//Author: Kyle McColgan
//Date: 12 February 2026
//Description: This file contains the unit test suite for the Timer project useTimer hook.

import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useTimer, DEFAULT_DURATION } from "../hooks/useTimer.js";

describe("useTimer hook", () => {
    let currentTime = 0;
    beforeEach(() => {
        currentTime = 0; //Reset fake Date.
        localStorage.clear(); //Clear timers before each test.
        jest.useFakeTimers();
        jest.spyOn(global.Date, "now").mockImplementation(() => currentTime);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

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
    test("5. counts down over time", () => {
        const { result } = renderHook(() => useTimer());

        act(() => result.current.start());

        act(() => {
            currentTime += 1000;
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.timeLeft).toBeLessThan(DEFAULT_DURATION);
    });

    //Test #6
    test("6. stops at zero", () => {
        const { result } = renderHook(() => useTimer());

        act(() => result.current.start());

        act(() => {
            currentTime += DEFAULT_DURATION + 100;
            jest.advanceTimersByTime(DEFAULT_DURATION + 100);
        });

        expect(result.current.timeLeft).toBe(0);
        expect(result.current.running).toBe(false);
    });

    //Test #7 - TODO....
    test("7. adds completed timer to pastTimers", () => {
        const { result } = renderHook(() => useTimer());

        act(() => result.current.start());

        act(() => {
            currentTime += DEFAULT_DURATION + 100;
            jest.advanceTimersByTime(DEFAULT_DURATION + 100);
        });

        expect(result.current.pastTimers.length).toBe(1);
        expect(result.current.pastTimers[0].duration).toBe(DEFAULT_DURATION);
    });

    //Test #8
    test("8. writes completed timer to localStorage", () => {
        const spy = jest.spyOn(Storage.prototype, "setItem");
        const { result } = renderHook(() => useTimer());

        act(() => result.current.start());

        act(() => {
            currentTime += DEFAULT_DURATION + 100;
            jest.advanceTimersByTime(DEFAULT_DURATION + 100);
        });

        expect(spy).toHaveBeenCalledWith(
            "pastTimers",
            expect.any(String)
        );
    });

    //Test #9
    test("9. resets to original duration", () => {
        const { result } = renderHook(() => useTimer());

        act(() => {
            result.current.start();
            currentTime += 2000;
            jest.advanceTimersByTime(2000);
            result.current.reset();
        });

        expect(result.current.timeLeft).toBe(DEFAULT_DURATION);
        expect(result.current.running).toBe(false);
    });

    //Test #10
    test("10. clears past timers", () => {
        const { result } = renderHook(() => useTimer());

        act(() => result.current.start());

        act(() => {
            currentTime += DEFAULT_DURATION + 100;
            jest.advanceTimersByTime(DEFAULT_DURATION + 100);
        });

        act(() => result.current.clearPastTimers());

        expect(result.current.pastTimers).toEqual([]);
        expect(localStorage.getItem("pastTimers")).toBeNull();
    });
});
