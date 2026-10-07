//File name: useAmbientEngine.js
//Author: Kyle McColgan
//Date: 6 October 2026
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

function lerp(start, end, amount)
{
    return start + (end - start) * amount;
}

function wrapHue(value)
{
    return ((value % 360) + 360) % 360;
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

    //Convert linear timer progress into a
    //softer atmospheric response.
    const elapsed = 1 - progress;
    const energy = smoothstep(elapsed);

    //Slow spectral clock.
    //Using timer time rather than performance.now()
    //keeps color evolution synchronized with the
    //timer's continous visual state.
    const clock = Math.max(0, currentTime) * 0.00022;

    //Layer several extremely low-frequence waves.
    //Their combined movement is intentionally subtle:
    //enough to prevent the atmosphere from becoming static,
    //but slow enough that it never reads as an animation loop...
    const spectralWave =
        Math.sin(clock * 0.40) * 6 +
        Math.sin(clock * 0.16) * 3.5;

    //The timer drivers the primary color journey:
    //deep blue -> cyan / violet -> warm amber -> subtle red-orange.
    const baseHue = lerp(START_HUE, END_HUE, energy);
    const hue = baseHue + spectralWave * (0.34 + energy * 0.46);
    const secondaryHue = wrapHue(hue + 60 + Math.sin(clock * 0.12) * 4);

    const glow = 0.26 + energy * 0.74;
    const motion = running ? 0.28 + energy * 0.72 : 0.14 + energy * 0.08;
    const blur = lerp(146, 96, energy);
    const scale = 1 + energy * 0.11;
    const rotation = `${energy * 7}deg`;

    //Micro motion.
    const pulse = 0.50 + Math.sin(clock * 1.45) * 0.42;
    const drift = Math.sin(clock * 0.42);
    const shimmer = 0.50 + Math.sin(clock * 3.6) * 0.50;
    const intensity = 0.18 + energy * 0.82;

    //Keep the complete atmospheric state in one memoized
    //style object so React only updates the CSS variables that actually change.
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
