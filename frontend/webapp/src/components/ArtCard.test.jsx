import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import ArtCard from "./ArtCard";

// ----------------------------------
// Mocks Setup
// ----------------------------------

// Next.js Image: Render an <img> element with a fallback alt text.
jest.mock("next/image", () => (props) => {
  return <img {...props} alt={props.alt || "mock-image"} />;
});

// Next.js Link: Render a simple <a> element.
jest.mock("next/link", () => ({ children, href }) => <a href={href}>{children}</a>);

// Firebase config and Firestore mocks.
jest.mock("@/firebase/config", () => ({ db: {} }));
jest.mock("firebase/firestore", () => {
  const originalModule = jest.requireActual("firebase/firestore");
  return {
    ...originalModule,
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

// Child component mocks.
// TagCarousel is mocked to render a div with a specific test id.
jest.mock("./TagCarousel", () => {
  return ({ children }) => <div data-testid="tag-carousel">{children}</div>;
});
// CategoryTag is mocked to simply render its id.
jest.mock("./CategoryTag", () => {
  return ({ id }) => <div>{id}</div>;
});

// ----------------------------------
// Test Data
// ----------------------------------
const mockArt = {
  id: "art123",
  title: "Beautiful Sunset",
  image: "/sunset.jpg",
  categories: [{ id: "Landscape", name: "Landscape" }],
  themes: ["Nature", "Evening"],
  userID: "user456",
  date: "2023-06-15",
};

// ----------------------------------
// Test Suite
// ----------------------------------
describe("ArtCard Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the ArtCard with title, image, tag carousels, and artist info", async () => {
    await act(async () => {
      render(<ArtCard art={mockArt} />);
    });

    // Check that the title and image render correctly.
    expect(screen.getByText("Beautiful Sunset")).toBeInTheDocument();
    expect(screen.getByAltText("Beautiful Sunset")).toBeInTheDocument();

    // Use getAllByTestId to get both tag carousel elements.
    const tagCarousels = screen.getAllByTestId("tag-carousel");
    // Expect two tag carousels: one for categories and one for themes.
    expect(tagCarousels).toHaveLength(2);

    // The first tag carousel should render the category ("Landscape").
    expect(tagCarousels[0]).toHaveTextContent("Landscape");

    // The second tag carousel should render the themes ("Nature" and "Evening").
    expect(tagCarousels[1]).toHaveTextContent("Nature");
    expect(tagCarousels[1]).toHaveTextContent("Evening");

    // Verify that the posted date is rendered.
    expect(screen.getByText("Posted 2023-06-15")).toBeInTheDocument();

    // Wait for the asynchronous artist data to load, then verify the artist's name.
    await waitFor(() => {
      expect(screen.getByText("Mock Artist")).toBeInTheDocument();
    });
  });

  it("renders fallback artist info when artist data is missing", async () => {
    // Force getDoc to return a value indicating no user data.
    const { getDoc } = require("firebase/firestore");
    getDoc.mockResolvedValueOnce({ exists: () => false });

    await act(async () => {
      render(<ArtCard art={mockArt} />);
    });

    await waitFor(() => {
      expect(screen.getByText("Unknown User")).toBeInTheDocument();
    });
  });

  it("renders default alt text when title is missing", () => {
    const artWithoutTitle = { ...mockArt, title: "" };
    render(<ArtCard art={artWithoutTitle} />);
    // Since the title is empty, the Next.js Image mock falls back to "mock-image".
    expect(screen.getByAltText("mock-image")).toBeInTheDocument();
  });
});
