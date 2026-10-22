//File name: AnimatedDigit.jsx
//Author: Kyle McColgan
//Date: 21 October 2026
//Description: This file contains the digits component for the timer React project.

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import "./AnimatedDigit.css";

const TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1], };

const AnimatedDigit = ({ value, isCenti = false }) =>
{
  const shouldReduceMotion = useReducedMotion();
  const motionProps = shouldReduceMotion
    ? {
        initial: false,
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: "2.5%", scale: 0.996 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: "-2.5%", scale: 1.004 },
        transition: TRANSITION,
      };

  return (
    <span className={`digit${isCenti ? " centi" : ""}`} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="value"
          {...motionProps}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedDigit;
