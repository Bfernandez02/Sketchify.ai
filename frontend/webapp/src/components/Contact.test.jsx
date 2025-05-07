import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import Contact from "./Contact";

// Mock next/image
jest.mock("next/image", () => (props) => <img {...props} alt={props.alt || "image"} />);

// Mocks for Firestore
const mockAddDoc = jest.fn();
const mockCollection = jest.fn();

jest.mock("firebase/firestore", () => {
  const original = jest.requireActual("firebase/firestore");
  return {
    ...original,
    addDoc: (...args) => mockAddDoc(...args),
    collection: (...args) => mockCollection(...args),
  };
});

jest.mock("@/firebase/config", () => ({
  db: {}, // mock db import
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);


describe("Contact Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all input fields", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
  });

  test("shows error if required fields are empty", async () => {
    render(<Contact />);
    fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));

    await waitFor(() => {
      const status = screen.getByTestId("form-status").textContent;
      expect([
        "Invalid email address.",
        "Please fill out all required fields.",
      ]).toContain(status);
    });
  });

  test("shows success message on successful submit", async () => {
    const mockCollectionRef = {}; // This can be an empty object
    mockCollection.mockReturnValue(mockCollectionRef);
    mockAddDoc.mockResolvedValue({id: "mockDocId"});

    render(<Contact/>);

    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: {value: "John Doe"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: {value: "1234567890"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Mail/i), {
      target: {value: "john@example.com"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Subject/i), {
      target: {value: "Test Subject"},
    });
    fireEvent.change(screen.getByPlaceholderText(/Message/i), {
      target: {value: "Hello!"},
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", {name: /Send Message/i}));
    });

    await waitFor(() => {
      expect(screen.getByTestId("form-status").textContent).toMatch(/Message sent successfully/i);
    });
  });


  test("shows error message on failed submit", async () => {
    mockCollection.mockReturnValue({ id: "mockCollection" });
    mockAddDoc.mockRejectedValueOnce(new Error("Simulated failure"));

    render(<Contact />);
    fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Phone Number/i), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Mail/i), {
      target: { value: "john@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Subject/i), {
      target: { value: "Test Subject" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Message/i), {
      target: { value: "Hello!" },
    });

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Send Message/i }));
    });

    await waitFor(() => {
      expect(screen.getByTestId("form-status")).toHaveTextContent(/An error occurred/i);
    });
  });
});
