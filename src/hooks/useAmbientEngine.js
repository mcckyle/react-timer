//File name: useAmbientEngine.js
//Author: Kyle McColgan
//Date: 15 July 2026
//Description: This file contains the background hook component for the timer React project.

import { useState, useEffect, useMemo, useRef } from "react";

export function useAmbientEngine({
    duration,
    timeLeft,
    running,
})
{
    const initialProgress = duration > 0 ? timeLeft / duration : 1;
    const [smoothProgress, setSmoothProgress] = useState(initialProgress);
    const progressRef = useRef(initialProgress);
    const rafRef = useRef(null);

    //RAF-driven visual smoothing.
    useEffect(() =>
    {
        const progress = duration > 0 ? timeLeft / duration : 1;

        if (!running)
        {
            progressRef.current = progress;
            setSmoothProgress(progress);
            return;
        }

        let previousFrame = performance.now();

        const animate = () =>
        {
            const now = performance.now();
            const delta = now - previousFrame;
            previousFrame = now;

            progressRef.current = Math.max(0, progressRef.current - (delta / duration));
            setSmoothProgress(progressRef.current);
            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () =>
        {
            cancelAnimationFrame(rafRef.current);
        }
    }, [running, duration, timeLeft]);

    //Continuous visual progress.
    const progress = Math.min(1, Math.max(0, smoothProgress));

    /* Dynamic ambient energy system.
     220 = cool blue, 160 = teal, 80 = lime, 18 = amber / red */
    const energy = Math.pow(1 - progress, 2.2);
    const hue = 220 - energy * 205;
    const secondaryHue = (hue + 65) % 360;

    const glow = 0.45 + energy * 1.55;
    const density = 0.08 + energy * 0.22;
    const motion = running ? energy : energy * 0.35;
    const pulse = running ? 0.2 + energy * 0.8 : 0.15;
    const blur = 120 + energy * 140;

    const style = useMemo(() => ({
        "--ambient-progress": progress,
        "--ambient-energy": energy,

        "--ambient-hue": hue,
        "--ambient-hue-secondary": secondaryHue,

        "--ambient-motion": motion,
        "--ambient-glow": glow,
        "--ambient-density": density,
        "--ambient-pulse": pulse,

        "--ambient-blur-soft": `${blur}px`,
        "--ambient-blur-strong": `${blur * 1.5}px`,
    }), [progress, energy, hue, secondaryHue, motion, glow, density, pulse, blur]);

    return {
        progress,
        energy,
        style
    };
}
