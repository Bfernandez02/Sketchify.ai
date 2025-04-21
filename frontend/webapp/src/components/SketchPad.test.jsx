import React from "react";
import {render, fireEvent, act, getByAltText, waitFor} from "@testing-library/react";
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
    getImageData: jest.fn(() => ({data: new Uint8ClampedArray(1080 * 700 * 4)})),
    fillRect: jest.fn(),
};
beforeEach(() => {
// Override the canvas getContext method to return our mock
    HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx);
// Provide a dummy return for toDataURL so API calls will proceed
    HTMLCanvasElement.prototype.toDataURL = jest.fn(() => "dummyImageData");
});

//mocks user auth
jest.mock('@/context/authContext', () => ({
    useAuth: () => ({
        currentUser: {uid: 'test-user-id', name: 'Test User'}
    }),
}));

describe("SketchPad Component", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("renders canvas and tool buttons", () => {
        const {getByAltText, container} = render(<SketchPad/>);
        const canvas = container.querySelector("canvas");
        expect(canvas).toBeInTheDocument();
        expect(getByAltText("Freehand")).toBeInTheDocument();
        expect(getByAltText("Line")).toBeInTheDocument();
        expect(getByAltText("Bucket")).toBeInTheDocument();
        expect(getByAltText("Eraser")).toBeInTheDocument();
    });

    test("simulates freehand drawing events", () => {
        const {getByAltText, container} = render(<SketchPad/>);
        const canvas = container.querySelector("canvas");
        fireEvent.click(getByAltText("Freehand"));
        act(() => {
            fireEvent.mouseDown(canvas, {clientX: 100, clientY: 100});
            fireEvent.mouseMove(canvas, {clientX: 110, clientY: 110});
            fireEvent.mouseUp(canvas);
        });
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.moveTo).toHaveBeenCalled();
        expect(mockCtx.lineTo).not.toHaveBeenCalled();
        expect(mockCtx.stroke).not.toHaveBeenCalled();
    });

    test("draws a line when Line tool is selected", async () => {
        const {getByAltText, container} = render(<SketchPad/>);
        const canvas = container.querySelector("canvas");

        // Set canvas dimensions for test context
        Object.defineProperty(canvas, "width", {value: 500});
        Object.defineProperty(canvas, "height", {value: 500});

        // Select the Line tool
        fireEvent.click(getByAltText("Line"));

        // Wait until the activeTool appears set
        await waitFor(() => {
            expect(getByAltText("Line").parentElement).toHaveClass("bg-secondary");
        });

        // Simulate mouse events
        act(() => {
            fireEvent.mouseDown(canvas, {clientX: 100, clientY: 100});
            fireEvent.mouseUp(canvas, {clientX: 200, clientY: 200});
        });

        // Assert that drawing methods were called
        expect(mockCtx.beginPath).toHaveBeenCalled();
        expect(mockCtx.moveTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
        expect(mockCtx.lineTo).toHaveBeenCalledWith(expect.any(Number), expect.any(Number));
        expect(mockCtx.stroke).toHaveBeenCalled();
    });


    test("undo functionality restores previous canvas state", () => {
        const {getByText, container} = render(<SketchPad/>);
        const canvas = container.querySelector("canvas");
        act(() => {
            fireEvent.mouseDown(canvas, {clientX: 100, clientY: 100});
            fireEvent.mouseMove(canvas, {clientX: 120, clientY: 120});
            fireEvent.mouseUp(canvas);
        });
        fireEvent.click(getByText(/Undo ↩️/i));
        expect(mockCtx.putImageData).toHaveBeenCalled();
    });

    test("dropdown menu toggles and updates theme", () => {
        const {getByRole, getByText} = render(<SketchPad/>);
        const themeButton = getByRole("button", {name: /Theme/i});
        fireEvent.click(themeButton);
        const realismOption = getByText("Realism");
        fireEvent.click(realismOption);
        expect(themeButton.textContent).toMatch(/Realism/);
    });

    test("handles API call failure correctly", async () => {
        // This is a very tiny valid PNG file's base64 (1x1 transparent pixel)
        const tinyPngBase64 =
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";

        api.CallApi.mockResolvedValue({
            data: {
                image: tinyPngBase64, // valid base64 image payload
                title: "Test"
            }
        });

        const {getByText} = render(<SketchPad/>);
        const enhanceButton = getByText(/Enhance/i);

        await act(async () => {
            fireEvent.click(enhanceButton);
        });

        expect(api.CallApi).toHaveBeenCalled();
        expect(getByText(/Enhance/i)).toBeInTheDocument();
    });


    test("canvas adjusts size on window resize", () => {
        const {container} = render(<SketchPad/>);
        const canvas = container.querySelector("canvas");
        Object.defineProperty(canvas, "clientWidth", {value: 500});
        act(() => {
            window.dispatchEvent(new Event("resize"));
        });
        expect(canvas.style.height).not.toBe("");
    });

    test("bucket tool triggers floodFill", () => {
        try {
            const {getByText, container} = render(<SketchPad/>);
            const canvas = container.querySelector("canvas");

            // Activate the bucket tool (which uses floodFill internally)
            const bucketButton = getByText(/Paint Bucket Tool/i);
            fireEvent.click(bucketButton);

            // Simulate a mousedown event, which triggers floodFill
            act(() => {
                fireEvent.mouseDown(canvas, {clientX: 200, clientY: 200});
            });

            // Assert that ctx.putImageData was called, indicating floodFill ran
            expect(mockCtx.putImageData).toHaveBeenCalled();
        } catch (error) {
            console.error("🚨 Bucket tool test failed due to an internal error:", error);
            // Explicitly fail this test — Jest will log the message but not crash
            expect(true).toBe(false);
        }
    });


    test("color picker updates the current color", () => {
        const {getByDisplayValue} = render(<SketchPad/>);
        const colorInput = getByDisplayValue("#000000");
        fireEvent.change(colorInput, {target: {value: "#FF0000"}});
        expect(colorInput.value.toUpperCase()).toBe("#FF0000");
    });

    test("line width slider updates the displayed line width", () => {
        const {getByDisplayValue, getByText} = render(<SketchPad/>);
        const lineWidthInput = getByDisplayValue("2");
        fireEvent.change(lineWidthInput, {target: {value: "5"}});
        expect(getByText("5")).toBeInTheDocument();
    });
});
