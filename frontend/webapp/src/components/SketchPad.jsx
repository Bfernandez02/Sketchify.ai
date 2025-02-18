import React, { useRef, useState, useEffect } from "react";
import { CallApi } from "../../api/api";

const DropdownMenu = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative">
      <button
        className="w-[300px] bg-primary text-white px-4 py-2 rounded-lg flex items-center font-fraunces text-center justify-center"
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
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");

  const getCanvasImage = () => {
    return canvasRef.current.toDataURL("image/png");
  };

  const HandleAPICall = async () => {
    const ImageData = getCanvasImage();
    const response = await CallApi(ImageData);

    if (response && response.image) {
      const img = new Image();
      img.src = response.image;
      img.onload = () => {
        ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctxRef.current.drawImage(img, 0, 0);
      };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    
    canvas.width = 1080;
    canvas.height = 700;
    canvas.style.width = "1080px";
    canvas.style.height = "700px";

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    
    ctxRef.current = ctx;
  }, []);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height
    };
  };

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
    ctxRef.current.strokeStyle = currentColor; // Ensure color is set when starting to draw
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
    <div className="text-gray-900 flex flex-row items-center py-8 justify-center">
      <div className="mt-6 flex gap-6">
        {/* Sidebar */}
        <div className="flex flex-col bg-gray-900 text-white p-2 rounded-lg space-y-4">
          <div className="p-2 bg-yellow-500 rounded-md flex items-center justify-center">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => setCurrentColor(e.target.value)}
              className="w-6 h-6 cursor-pointer"
            />
          </div>
          <button className="p-2">⭐</button>
          <button className="p-2">T</button>
          <button className="p-2">⚙️</button>
          <button className="p-2">➕</button>
        </div>

        {/* Sketchpad */}
        <div className="flex-1 border rounded-lg bg-white shadow-md relative">
          <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            className="rounded-lg"
          ></canvas>
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

        {/* Right sidebar */}
        <div className="flex flex-col space-y-6">
          <textarea
            className="border border-black placeholder-gray-500 px-3 py-2 rounded-lg bg-background w-[300px] h-[250px] text-top resize-none"
            placeholder="Additional Prompts..."
          ></textarea>

          <DropdownMenu label="Theme" options={["Dark", "Light", "Custom"]} />
          <DropdownMenu label="Option" options={["Option 1", "Option 2", "Option 3"]} />
          <DropdownMenu label="Option" options={["Option A", "Option B", "Option C"]} />

          <div className="pt-28">
            <button
              className="w-[300px] bg-secondary text-white px-4 py-2 rounded-lg flex items-center font-fraunces text-center justify-center"
              onClick={HandleAPICall}
            >
              Enhance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SketchPad;