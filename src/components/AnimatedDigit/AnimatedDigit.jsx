//File name: AnimatedDigit.jsx
//Author: Kyle McColgan
//Date: 23 July 2026
//Description: This file contains the digits component for the timer React project.

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import "./AnimatedDigit.css";

const TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1], };

const AnimatedDigit = ({ value, isCenti = false }) => {
  const className = `digit${isCenti ? " centi" : ""}`;

  return (
    <span className={className} aria-hidden="true">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="value"
          initial={{ opacity: 0, y: "14%", scale: 0.94, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: "-14%", scale: 1.04, filter: "blur(5px)" }}
          transition={TRANSITION}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedDigit;
