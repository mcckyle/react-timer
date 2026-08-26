//File name: useAmbientEngine.js
//Author: Kyle McColgan
//Date: 25 August 2026
//Description: This file contains the background hook component for the timer React project.

import { useMemo } from "react";

const START_HUE = 220;
const END_HUE = 18;

function smoothstep(value)
{
    const t = Math.min(1, Math.max(0, value));

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

    const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 1;

    //0 = timer beginning. 1 = timer completion.
    const elapsed = 1 - progress;

    //Continous energy curve.
    const energy = smoothstep(elapsed);

    //Atmospheric clock.
    //This is intentionally calculated once per
    //render from the same continous animation
    //updates coming from useTimer.
    //It adds life without determining timer state.
    const now = performance.now() * 0.00008;

    const spectral =
    Math.sin(now * 0.42) * 8 +
    Math.sin(now * 0.16) * 5 +
    Math.sin(now * 0.055) * 3;

    //The timer's continous energy is the dominant
    //influence. Spectral movement merely breathes
    //around the underlying hue.
    const hue = START_HUE - (START_HUE - END_HUE) * energy + spectral * (0.45 + energy * 0.55);
    const secondaryHue = (hue + 62 + Math.sin(now * 0.12) * 7) % 360;

    const glow = 0.3 + energy * 0.70;
    const motion = running ? energy : energy * 0.25;
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
