import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Footer from "./Footer";

// Mock Next.js Link
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);

// Mock Firebase
jest.mock("../firebase/config", () => ({ db: {} }));

jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  addDoc: jest.fn(() => Promise.resolve()),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() =>
    Promise.resolve({
      empty: true,
    })
  ),
}));

describe("Footer", () => {
  test("renders brand name and quick links", () => {
    render(<Footer />);
    expect(screen.getByText("Sketchify")).toBeInTheDocument();
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Sketch")).toBeInTheDocument();
    expect(screen.getByText("Explore")).toBeInTheDocument();
    expect(screen.getByText("Contact")).toBeInTheDocument();
  });

  test("allows user to type email into newsletter input", () => {
    render(<Footer />);
    const input = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(input, { target: { value: "test@example.com" } });
    expect(input.value).toBe("test@example.com");
  });

  test("submits valid email and shows success message", async () => {
    const { addDoc } = require("firebase/firestore");
    render(<Footer />);

    const input = screen.getByPlaceholderText(/enter your email/i);
    const button = screen.getByRole("button", { name: /subscribe/i });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() =>
      expect(
        screen.getByText(/thank you for subscribing/i)
      ).toBeInTheDocument()
    );
    expect(addDoc).toHaveBeenCalled();
  });
});
