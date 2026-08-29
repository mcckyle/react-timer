//File name: useAmbientEngine.js
//Author: Kyle McColgan
//Date: 28 August 2026
//Description: This file contains the background hook component for the timer React project.

import { useMemo } from "react";

const START_HUE = 220;
const END_HUE = 18;

function clamp(value, min = 0, max = 1)
{
    return Math.min(max, Math.max(min, value));
}

function smoothstep(value)
{
    const t = clamp(value);

    return t * t * (3 - 2 * t);
}

export function useAmbientEngine({ duration, timeLeft, visualTimeLeft, running })
{
    //Always prefer the continous visual clock.
    //Falling back to timeLeft keeps the hook
    //compatible with callers that have not yet
    //been migrated.
    const currentTime = typeof visualTimeLeft === "number"
    ? visualTimeLeft
    : timeLeft;

    //0 = timer beginning. 1 = timer completion.
    const progress = duration > 0 ? clamp(currentTime / duration) : 1;

    //Convert linear time progress into a deliverately
    //softer atmospheric response.
    const elapsed = 1 - progress;
    const energy = smoothstep(elapsed);

    //Slow spectral clock.
    //These frequencies are intentionally extremely low.
    //They create continous color drift rather than
    //an obvious animated hue cycle.
    const now = performance.now() * 0.00001;

    const spectral =
        Math.sin(now * 0.42) * 7 +
        Math.sin(now * 0.17) * 4 +
        Math.sin(now * 0.063) * 2.5;

    //The timer's continous energy is the dominant
    //influence. Spectral movement merely breathes
    //around the underlying hue.
    const hue = START_HUE - (START_HUE - END_HUE) * energy + spectral * (0.45 + energy * 0.55);
    const secondaryHue = (hue + 62 + Math.sin(now * 0.13) * 6) % 360;

    const glow = 0.3 + energy * 0.70;
    const motion = running ? 0.35 + energy * 0.65 : 0.18 + energy * 0.12;
    const blur = 140 - energy * 45;
    const scale = 1 + energy * 0.12;
    const rotation = `${energy * 8}deg`;

    //Micro motion.
    const pulse = 0.50 + Math.sin(now * 1.6) * 0.50;
    const drift = Math.sin(now * 0.45);
    const shimmer = 0.50 + Math.sin(now * 4.0) * 0.50;
    const intensity = 0.20 + energy * 0.80;

    const style = useMemo(() => ({
        "--ambient-progress": progress,
        "--ambient-energy": energy,

        "--ambient-hue": hue,
        "--ambient-hue-secondary": secondaryHue,

        "--ambient-motion": motion,
        "--ambient-glow": glow,

        "--ambient-scale": scale,
        "--ambient-rotation": rotation,

        "--ambient-pulse": pulse,
        "--ambient-drift": drift,
        "--ambient-shimmer": shimmer,
        "--ambient-intensity": intensity,

        "--ambient-blur-soft": `${blur}px`,
        "--ambient-blur-strong": `${blur * 1.6}px`,
    }), [progress, energy, hue, secondaryHue, motion, glow, scale, rotation, pulse, drift, shimmer, intensity, blur]);

    return {
        progress,
        energy,
        style
    };
}
