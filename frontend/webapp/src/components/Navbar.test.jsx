import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "./Navbar";

// Mock Next.js modules
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock("next/image", () => (props) => <img {...props} alt={props.alt || "mock-img"} />);

// Mock useAuth
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ currentUser: null }), // not logged in by default
}));

// Mock useRouter (if used internally)
jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/",
  }),
}));

// Optional: Suppress act warnings for async setState
const originalError = console.error;
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
    if (typeof msg === "string" && msg.includes("act")) return;
    originalError(msg, ...args);
  });
});
afterAll(() => {
  console.error.mockRestore();
});

describe("Navbar", () => {
  test("renders all navigation links on desktop", () => {
    render(<Navbar />);
    expect(screen.getAllByText("Home").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sketch").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Explore").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Contact").length).toBeGreaterThan(0);
  });

  test("shows login button when user is not authenticated", () => {
    render(<Navbar />);
    expect(screen.getAllByText(/Login/i).length).toBeGreaterThan(0);
  });

  test("toggles mobile menu when hamburger button is clicked", () => {
    render(<Navbar />);
    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Look for a mobile nav menu that appears after click
    const mobileMenu = screen.getByTestId("mobile-nav");
    expect(mobileMenu).toHaveClass("right-0");
  });
});