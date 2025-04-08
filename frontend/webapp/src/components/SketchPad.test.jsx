import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import SketchPad from "./SketchPad";
import * as api from "../../api/api";

// Mock the API call
jest.mock("../../api/api", () => ({
  CallApi: jest.fn(),
}));

// Create a mock for the canvas context methods
const mockCtx = {
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  closePath: jest.fn(),
  clearRect: jest.fn(),
  putImageData: jest.fn(),
  getImageData: jest.fn(() => ({ data: new Uint8ClampedArray(1080 * 700 * 4) })),
};

// Override the canvas getContext method to return our mock
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
// Provide a dummy return for toDataURL so API calls will proceed
HTMLCanvasElement.prototype.toDataURL = jest.fn(() => "dummyImageData");

describe("SketchPad Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders canvas and tool buttons", () => {
    const { getByText, container } = render(<SketchPad />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeInTheDocument();
    expect(getByText(/Freehand Tool/i)).toBeInTheDocument();
    expect(getByText(/Line Tool/i)).toBeInTheDocument();
    expect(getByText(/Paint Bucket Tool/i)).toBeInTheDocument();
    expect(getByText(/Eraser Tool/i)).toBeInTheDocument();
  });

  test("simulates freehand drawing events", () => {
    const { getByText, container } = render(<SketchPad />);
    const canvas = container.querySelector("canvas");

    // Activate freehand tool using getByText to locate the button
    const freehandButton = getByText(/Freehand Tool/i);
    fireEvent.click(freehandButton);

    // Simulate drawing: mousedown -> mousemove -> mouseup
    act(() => {
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      // Freehand mode in your implementation only uses beginPath() and moveTo()
      fireEvent.mouseMove(canvas, { clientX: 110, clientY: 110 });
      fireEvent.mouseUp(canvas);
    });

    // Verify that for freehand drawing only beginPath() and moveTo() are called
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).not.toHaveBeenCalled();
    expect(mockCtx.stroke).not.toHaveBeenCalled();
  });

  test("simulates line drawing", () => {
    const { getByText, container } = render(<SketchPad />);
    const canvas = container.querySelector("canvas");

    // Activate the line tool
    const lineButton = getByText(/Line Tool/i);
    fireEvent.click(lineButton);

    // Simulate mouse down and mouse up to draw the line
    act(() => {
      fireEvent.mouseDown(canvas, { clientX: 50, clientY: 50 });
    });
    act(() => {
      fireEvent.mouseUp(canvas, { clientX: 150, clientY: 150 });
    });

    // Verify that drawing methods were called for line tool
    expect(mockCtx.beginPath).toHaveBeenCalled();
    expect(mockCtx.moveTo).toHaveBeenCalled();
    expect(mockCtx.lineTo).toHaveBeenCalled();
    expect(mockCtx.stroke).toHaveBeenCalled();
  });

  test("undo functionality restores previous canvas state", () => {
    const { getByText, container } = render(<SketchPad />);
    const canvas = container.querySelector("canvas");

    // Simulate a drawing event to push state to the undo stack
    act(() => {
      fireEvent.mouseDown(canvas, { clientX: 100, clientY: 100 });
      fireEvent.mouseMove(canvas, { clientX: 120, clientY: 120 });
      fireEvent.mouseUp(canvas);
    });

    // Click the Undo button
    const undoButton = getByText(/Undo ↩️/i);
    fireEvent.click(undoButton);
    // Verify that putImageData was called to restore the previous state
    expect(mockCtx.putImageData).toHaveBeenCalled();
  });

  test("dropdown menu toggles and updates theme", () => {
    const { getByRole, getByText, queryByText } = render(<SketchPad />);

    // Get the dropdown button by its role and visible text
    const themeButton = getByRole("button", { name: /Theme/i });

    // Open the dropdown
    fireEvent.click(themeButton);
    const realismOption = getByText("Realism");
    expect(realismOption).toBeInTheDocument();

    // Click the option and expect the button text to update
    fireEvent.click(realismOption);
    expect(themeButton.textContent).toMatch(/Realism/);
  });

  test("handles API call failure correctly", async () => {
    // Simulate API failure by resolving with null
    api.CallApi.mockResolvedValue(null);

    const { getByText } = render(<SketchPad />);
    const enhanceButton = getByText(/Enhance/i);

    await act(async () => {
      fireEvent.click(enhanceButton);
    });

    // Verify that the API call was made and then the button text reverts back
    expect(api.CallApi).toHaveBeenCalled();
    expect(getByText(/Enhance/i)).toBeInTheDocument();
  });

  test("canvas adjusts size on window resize", () => {
    const { container } = render(<SketchPad />);
    const canvas = container.querySelector("canvas");
    // Set the clientWidth property for testing purposes
    Object.defineProperty(canvas, "clientWidth", { value: 500 });
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });
    // Check that canvas's style height is updated (i.e., not empty)
    expect(canvas.style.height).not.toBe("");
  });

  // --- Additional tests for floodFill, color picker, and line width ---
  test("bucket tool triggers floodFill", () => {
    const { getByText, container } = render(<SketchPad />);
    const canvas = container.querySelector("canvas");

    // Activate the bucket tool (which uses floodFill internally)
    const bucketButton = getByText(/Paint Bucket Tool/i);
    fireEvent.click(bucketButton);

    // Simulate a mousedown event, which triggers floodFill
    act(() => {
      fireEvent.mouseDown(canvas, { clientX: 200, clientY: 200 });
    });

    // Assert that ctx.putImageData was called, indicating floodFill ran
    expect(mockCtx.putImageData).toHaveBeenCalled();
  });

  test("color picker updates the current color", () => {
    const { getByDisplayValue } = render(<SketchPad />);
    // The default value is "#000000" according to the input element
    const colorInput = getByDisplayValue("#000000");
    fireEvent.change(colorInput, { target: { value: "#FF0000" } });
    // After the change, the value should reflect the new color
    expect(colorInput.value.toUpperCase()).toBe("#FF0000");
  });

  test("line width slider updates the displayed line width", () => {
    const { getByDisplayValue, getByText } = render(<SketchPad />);
    // The line width input has a default value of "2"
    const lineWidthInput = getByDisplayValue("2");
    fireEvent.change(lineWidthInput, { target: { value: "5" } });
    // Expect that an element in the DOM now displays "5" (the updated line width)
    expect(getByText("5")).toBeInTheDocument();
  });
});
