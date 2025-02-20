import React, { useRef, useState, useEffect } from "react";
import { CallApi } from "../../api/api";

const DropdownMenu = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative w-full md:w-[300px]">
      <button
        className="w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center font-fraunces text-center justify-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected || label}
        <span className="ml-2">▼</span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const SketchPad = () => {
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");

  const getCanvasImage = () => {
    return canvasRef.current.toDataURL("image/png");
  };

  const HandleAPICall = async () => {
    setIsLoading(true);
    const ImageData = getCanvasImage();
    const response = await CallApi(ImageData);

    if (response) {
      console.log("Image Received");
      const img = new Image();
      img.src = `data:image/png;base64,${response.data.image}`;

      img.onload = () => {
        const canvas = canvasRef.current;
        ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
        ctxRef.current.drawImage(img, 0, 0, canvas.width, canvas.height);
        setIsLoading(false);
      };
      img.onerror = () => setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set internal resolution
    canvas.width = 1080;
    canvas.height = 700;
    // For responsiveness, set canvas style to full width with a max width
    canvas.style.width = "100%";
    canvas.style.maxWidth = "1080px";
    canvas.style.height = "auto";

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;

    ctxRef.current = ctx;
  }, [currentColor]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height,
    };
  };

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
    ctxRef.current.strokeStyle = currentColor;
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="text-gray-900 flex flex-col md:flex-row items-center py-8 justify-center px-4">
      <div className="mt-6 flex flex-col md:flex-row md:gap-6 w-full">
        {/* Left Sidebar */}
        <div className="flex flex-col bg-gray-900 text-white p-1 rounded-lg space-y-4 w-full md:w-auto">
          <div className="p-2 bg-yellow-500 rounded-md flex items-center justify-center">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-6 h-6 cursor-pointer"
            />
          </div>
          <button className="md:p-2 md:text-md text-sm">⭐</button>
          <button className="md:p-2 md:text-md text-sm">T</button>
          <button className="md:p-2 md:text-md  text-sm">⚙️</button>
          <button className="md:p-2 md:text-md text-sm">➕</button>
        </div>

        {/* Sketchpad Canvas */}
        <div className="flex-1 border rounded-lg bg-white shadow-md relative w-full">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="rounded-lg"
          ></canvas>
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
              <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin mb-4"></div>
              <span className="text-white text-6xl font-fraunces">Enhancing....</span>
            </div>
          )}
          <button
            className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-md"
            onClick={() =>
              ctxRef.current.clearRect(
                0,
                0,
                canvasRef.current.width,
                canvasRef.current.height
              )
            }
          >
            Clear 🔲
          </button>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col space-y-6 w-full md:w-auto">
          <textarea
            className="border border-black placeholder-gray-500 px-3 py-2 rounded-lg bg-background w-full md:w-[300px] h-[250px] text-top resize-none"
            placeholder="Additional Prompts..."
          ></textarea>

          <DropdownMenu label="Theme" options={["Dark", "Light", "Custom"]} />
          <DropdownMenu
            label="Option"
            options={["Option 1", "Option 2", "Option 3"]}
          />
          <DropdownMenu
            label="Option"
            options={["Option A", "Option B", "Option C"]}
          />

          <div className="pt-8">
            <button
              className={`w-full md:w-[300px] bg-secondary text-white px-4 py-2 rounded-lg flex items-center font-fraunces text-center justify-center ${
                isLoading ? "opacity-50" : "opacity-100"
              }`}
              onClick={HandleAPICall}
              disabled={isLoading}
            >
              {isLoading ? "Enhancing..." : "Enhance"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchPad;
