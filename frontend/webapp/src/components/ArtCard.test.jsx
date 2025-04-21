import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import ArtCard from "./ArtCard";

// Mocks
jest.mock("next/image", () => (props) => <img {...props} />);
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);
jest.mock("./SaveButton", () => () => <div data-testid="save-button" />);
jest.mock("./CategoryTag", () => ({ id, className }) => <div className={className}>{id}</div>);
jest.mock("./TagCarousel", () => () => <div data-testid="tag-carousel">Mock Carousel</div>);

// ✅ Mock firebase config
jest.mock("@/firebase/config", () => ({ db: {} }));

// ✅ Mock Firestore behavior
jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(() =>
    Promise.resolve({
      exists: () => true,
      data: () => ({
        name: "Mock Artist",
        profileImage: "/mock-profile.jpg",
      }),
    })
  ),
}));

// ✅ Mock auth and utilities
jest.mock("@/context/authContext", () => ({
  useAuth: () => ({
    currentUser: { uid: "mockUser", email: "mock@example.com" },
  }),
}));

jest.mock("@/utils/generalUtils", () => ({
  formatTimeAgo: () => "96w",
}));

const mockArt = {
  id: "art123",
  title: "Beautiful Sunset",
  image: "/sunset.jpg",
  theme: "Nature",
  userID: "user456",
  createdAt: {
    seconds: Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 7 * 96,
  },
};

describe("ArtCard Component", () => {
  test("renders the ArtCard with title, image, tag carousel, and artist info", async () => {
    await act(async () => {
      render(<ArtCard art={mockArt} />);
    });

    expect(screen.getByAltText("Beautiful Sunset")).toBeInTheDocument();
    expect(screen.getByText("Beautiful Sunset")).toBeInTheDocument();

    // ✅ Wait for artist data to be populated
    await waitFor(() => {
      expect(screen.getByText("Mock Artist")).toBeInTheDocument();
    });

    expect(screen.getByText("Posted 96w ago")).toBeInTheDocument();
    expect(screen.getByTestId("save-button")).toBeInTheDocument();
    expect(screen.getByTestId("tag-carousel")).toBeInTheDocument();
  });

  test("renders fallback artist info when artist is missing", async () => {
    const { getDoc } = require("firebase/firestore");
    getDoc.mockResolvedValueOnce({ exists: () => false });

    await act(async () => {
      render(<ArtCard art={mockArt} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Unknown User")).toBeInTheDocument();
    });
  });

  test("renders default alt text when title is missing", async () => {
    const artWithoutTitle = { ...mockArt, title: "" };

    await act(async () => {
      render(<ArtCard art={artWithoutTitle} />);
    });

    expect(screen.getByAltText("")).toBeInTheDocument();
  });
});
