//File name: AnimatedDigit.test.jsx
//Author: Kyle McColgan
//Date: 16 July 2026
//Description: This file contains the unit test suite for the AnimatedDigit component.

import React from "react";
import { render, screen } from "@testing-library/react";
import AnimatedDigit from "../components/AnimatedDigit/AnimatedDigit.jsx";

describe("AnimatedDigit Component", () => {

    //Test #1: Basic render - ensures no crash.
    test("1. renders without crashing", () => {
        render(<AnimatedDigit value={0} />);
        expect(screen.getByText("0")).toBeInTheDocument();
    });

    //Test #2: Correctness - Correct digit content.
    test("2. displays the correct digit value", () => {
        render(<AnimatedDigit value={5} />);
        expect(screen.getByText("5")).toBeInTheDocument();
    });

    //Test #3: Correctness - Updates values when the prop changes.
    test("3. updates digit value when props change", () => {
        const { rerender } = render(<AnimatedDigit value={1} />);
        expect(screen.getByText("1")).toBeInTheDocument();

        rerender(<AnimatedDigit value={9} />);
        expect(screen.getByText("9")).toBeInTheDocument();
    });

    //Test #4: Structure - Includes a slot wrapper.
    test("4. renders a slot wrapper element", () => {
        const { container } = render(<AnimatedDigit value={3} />);
        expect(container.firstChild).toBeInTheDocument();
    });

    //Test #5: Structure - Applies digit class for styling.
    test("5. applies the correct class to the animated digit", () => {
        const { container } = render(<AnimatedDigit value={4} />);
        const digit = container.querySelector("span");
        expect(digit.className).toContain("digit");
    });

    //Test #6: Accessibility - Uses aria-hidden for the animation element.
    test("6. marks the slot as aria-hidden", () => {
        const { container } = render(<AnimatedDigit value={7} />);
        expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
    });

    //Test #7:
    test("7. supports centi digits rendering", () => {
        const { container } = render(<AnimatedDigit value={8} isCenti />);
        expect(container.firstChild.className).toContain("centi");
    });

    //Test #8: React Mechanics - Supports multiple sequential renders.
    test("8. renders correctly across multiple rerenders", () => {
        const { rerender } = render(<AnimatedDigit value={2} />);

        rerender(<AnimatedDigit value={3} />);
        rerender(<AnimatedDigit value={4} />);

        expect(screen.getByText("4")).toBeInTheDocument();
    });

    //Test #9: React Mechanics - Does not render extra spans for the same value.
    test("9. renders two spans for normal digits", () => {
        const { container } = render(<AnimatedDigit value={5} />);
        const spans = container.querySelectorAll("span");
        expect(spans.length).toBe(2); //slot + digit.
    });

    //Test #10: Visual consistency - Snapshot test for consistent output.
    test("10. matches snapshot for digit 9", () => {
        const { asFragment } = render(<AnimatedDigit value={9} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
