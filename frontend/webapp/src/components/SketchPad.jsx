import React, { useRef, useState, useEffect } from "react";

const DropdownMenu = ({ label, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("");

  return (
    <div className="relative">
      <button
        className="w-[300px] bg-gray-800 text-white px-4 py-2 rounded-lg flex  items-center font-fraunces text-center justify-center"
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const scale = window.devicePixelRatio || 1;
    canvas.width = 1080 * scale;
    canvas.height = 700 * scale;
    canvas.style.width = "1200px";
    canvas.style.height = "700px";

    ctx.scale(scale, scale);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctxRef.current = ctx;
  }, []);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const pos = getMousePos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
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
    <div className=" text-gray-900 flex flex-row items-center py-8 justify-center">
      <div className="mt-6 flex gap-6">
        {/* Sidebar */}
        <div className="flex flex-col bg-gray-900 text-white p-2 rounded-lg space-y-4">
          <button className="p-2 bg-yellow-500 rounded-md">✏️</button>
          <button className="p-2">⭐</button>
          <button className="p-2">T</button>
          <button className="p-2">⚙️</button>
          <button className="p-2">➕</button>
        </div>

        {/* Sketchpad */}
        <div className="flex-1 border rounded-lg bg-white shadow-md relative">
          <canvas
            ref={canvasRef}
            className="w-[1080px] h-[700px] rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
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

        {/* Right Panel - Textarea & Dropdowns */}
        <div className="flex flex-col space-y-6">
          <textarea
            className="border border-black placeholder-gray-500 px-3 py-2 rounded-lg bg-background w-[300px] h-[250px] text-top resize-none"
            placeholder="Additional Prompts..."
          ></textarea>

          {/* Dropdown Menus */}
          <DropdownMenu label="Theme" options={["Dark", "Light", "Custom"]} />
          <DropdownMenu label="Option" options={["Option 1", "Option 2", "Option 3"]} />
          <DropdownMenu label="Option" options={["Option A", "Option B", "Option C"]} />
        </div>
      </div>
    </div>
  );
};

export default SketchPad;
