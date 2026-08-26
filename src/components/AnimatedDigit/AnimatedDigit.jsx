//File name: AnimatedDigit.jsx
//Author: Kyle McColgan
//Date: 25 August 2026
//Description: This file contains the digits component for the timer React project.

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import "./AnimatedDigit.css";

const TRANSITION = { duration: 0.22, ease: [0.22, 1, 0.36, 1], };

const AnimatedDigit = ({ value, isCenti = false }) => {
  const className = `digit${isCenti ? " centi" : ""}`;

  return (
    <span className={className} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="value"
          initial={{ opacity: 0, y: "7%", scale: 0.988 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: "-7%", scale: 1.012 }}
          transition={TRANSITION}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedDigit;
