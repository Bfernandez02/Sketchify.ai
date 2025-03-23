import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Contact from "./Contact";

// Mock Firebase and fetch
jest.mock("firebase/app");
jest.mock("firebase/firestore");
jest.mock("firebase/auth");
jest.mock("firebase/storage");

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

describe("Contact Form", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test("renders form fields", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Mail")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  //CURRENT NOT WORKING
  test("shows error with invalid email", async () => {
    const fetchSpy = jest.spyOn(global, "fetch").mockImplementation(() =>
      Promise.resolve({ ok: true })
    );
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<Contact />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "John Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mail"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Testing" },
    });
    fireEvent.change(screen.getByPlaceholderText("Message"), {
      target: { value: "Hello there!" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    // 🔍 Wait for the message to appear in the DOM
    const errorStatus = await screen.findByText(/invalid email address/i);
    expect(errorStatus).toBeInTheDocument();

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalledWith("Invalid email hit");

    fetchSpy.mockRestore();
    logSpy.mockRestore();
  });

  test("clears form and shows success message on valid submit", async () => {
    render(<Contact />);
    fireEvent.change(screen.getByPlaceholderText("Full Name"), {
      target: { value: "Jane Doe" },
    });
    fireEvent.change(screen.getByPlaceholderText("Mail"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone Number"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Subject"), {
      target: { value: "Support" },
    });
    fireEvent.change(screen.getByPlaceholderText("Message"), {
      target: { value: "Please help!" },
    });

    fireEvent.click(screen.getByText("Send Message"));

    const successStatus = await screen.findByText(/message sent successfully/i);
    expect(successStatus).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
