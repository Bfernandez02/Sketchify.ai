import React from "react";
import { render, screen } from "@testing-library/react";
import LandingHero from "./LandingHero";
import "@testing-library/jest-dom";
import { useRouter } from "next/router";

// Mock next/image and next/link
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);

// Mock the image import
jest.mock("../../public/painters.png", () => ({
  src: "/mock-painters.png",
}));

describe("LandingHero", () => {
  test("renders the main heading and subheading", () => {
    render(<LandingHero />);
    expect(
      screen.getByText(/From Sketch to Stunning/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Start sketching and bring your ideas to life!/i)
    ).toBeInTheDocument();
  });

  test("renders the Explore and Start Sketching buttons with correct links", () => {
    render(<LandingHero />);
    const exploreBtn = screen.getByRole("link", { name: /Explore/i });
    const sketchBtn = screen.getByRole("link", { name: /Start Sketching/i });

    expect(exploreBtn).toBeInTheDocument();
    expect(sketchBtn).toBeInTheDocument();
    expect(exploreBtn).toHaveAttribute("href", "/explore");
    expect(sketchBtn).toHaveAttribute("href", "/sketch");
  });

  test("renders the hero image with alt text", () => {
    render(<LandingHero />);
    const img = screen.getByAltText("painters");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/mock-painters.png");
  });
});
