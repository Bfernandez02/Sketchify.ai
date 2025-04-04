import React from "react";
import { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ArtCard from "./ArtCard";

let originalConsoleError;

beforeAll(() => {
  originalConsoleError = console.error;
  jest.spyOn(console, "error").mockImplementation((msg, ...args) => {
    if (typeof msg === "string" && msg.includes("act")) return;
    originalConsoleError(msg, ...args);
  });
});

afterAll(() => {
  console.error.mockRestore();
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Next.js mocks
jest.mock("next/image", () => (props) => <img {...props} alt={props.alt || "mock-image"} />);
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);

// Firebase config + firestore
jest.mock("@/firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => {
  const original = jest.requireActual("firebase/firestore");
  return {
    ...original,
    doc: jest.fn(),
    getDoc: jest.fn(() =>
      Promise.resolve({
        exists: () => true,
        data: () => ({
          name: "Mock Artist",
          profileImage: "/default-avatar.png",
        }),
      })
    ),
  };
});

// Mock child components
jest.mock("./TagCarousel", () => () => <div data-testid="mock-tag-carousel">Mock TagCarousel</div>);
jest.mock("./CategoryTag", () => () => <div>Impressionism</div>);

// Test data
const mockArt = {
  id: "abc123",
  title: "Starry Night",
  image: "/mock-art.jpg",
  categories: [{ id: "Impressionism", name: "Impressionism" }],
  themes: ["Night", "Stars"],
  userID: "user1",
  date: "2024-12-25",
};

describe("ArtCard", () => {
  test("renders the title, image, and artist name", async () => {
    await act(async () => {
      render(<ArtCard art={mockArt} />);
    });

    expect(screen.getByText("Starry Night")).toBeInTheDocument();
    expect(screen.getByAltText("Starry Night")).toBeInTheDocument();
    expect(screen.getByText(/impressionism/i)).toBeInTheDocument(); // ✅ more flexible
    expect(screen.getByText("Night")).toBeInTheDocument();
    expect(screen.getByText("Stars")).toBeInTheDocument();
    expect(screen.getByTestId("mock-tag-carousel")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Mock Artist")).toBeInTheDocument();
    });

    expect(screen.getByText("Posted 2024-12-25")).toBeInTheDocument();
  });

  test("renders fallback artist info when getDoc returns no data", async () => {
    const { getDoc } = require("firebase/firestore");
    getDoc.mockResolvedValueOnce({ exists: () => false });

    await act(async () => {
      render(<ArtCard art={mockArt} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Unknown User")).toBeInTheDocument();
    });
  });

  test("uses default alt text if title is missing", () => {
    const artWithoutTitle = { ...mockArt, title: "" };
    render(<ArtCard art={artWithoutTitle} />);
    expect(screen.getByAltText("mock-image")).toBeInTheDocument();
  });
});
