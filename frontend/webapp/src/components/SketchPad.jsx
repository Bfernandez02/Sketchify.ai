import React, { useRef, useState, useEffect } from "react";
import { CallApi } from "../../api/api";

const DropdownMenu = ({ id, label, options, openDropdown, setOpenDropdown, onThemeChange }) => {
  const [selected, setSelected] = useState("");
  const isOpen = openDropdown === id;

  const handleToggle = () => {
    setOpenDropdown(isOpen ? null : id);
  };

  return (
    <div className="relative w-full md:w-[300px]">
      <button
        className="w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center font-fraunces text-center justify-center"
        onClick={handleToggle}
      >
        {selected || label}
        <span className="ml-2">▼</span>
      </button>
      {isOpen && (
        <ul className="absolute left-0 mt-1 w-full border border-gray-300 rounded-lg shadow-lg z-50 font-fraunces bg-primary text-white text-center">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-gray-200 cursor-pointer hover:text-black text-lg"
              onClick={() => {
                setSelected(option);
                setOpenDropdown(null);

                if(onThemeChange){
                  onThemeChange(option);
                }
                //onThemeChange && onThemeChange(option); // Call parent handler
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
  const [openDropdown, setOpenDropdown] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [lineStart, setLineStart] = useState(null);
  const [lineWidth, setLineWidth] = useState(2);
  const [undoStack, setUndoStack] = useState([]); // Undo stack
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [ThemeData,Setheme] = useState("Default");


  const getCanvasImage = () => canvasRef.current.toDataURL("image/png");

  const handleThemeChange = (theme) => { // Function to handle theme change
    Setheme(theme);

    console.log(ThemeData)
  }

  useEffect(() =>{ 
    console.log("Current theme:",ThemeData);
  },[ThemeData]);

  const HandleAPICall = async () => {
    setIsLoading(true);
    const ImageData = getCanvasImage();
    const response = await CallApi(ImageData,ThemeData);

    if (response) {
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

  const updateCanvasSize = () => {
    const canvas = canvasRef.current;
    const aspectRatio = 700 / 1080;
    canvas.style.height = `${canvas.clientWidth * aspectRatio}px`;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1080;
    canvas.height = 700;
    canvas.style.width = "100%";
    updateCanvasSize();
    ctx.lineWidth = lineWidth;
    ctx.lineCap = "round";
    ctx.strokeStyle = currentColor;
    ctxRef.current = ctx;

    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  }, []);

  useEffect(() => {
    const ctx = ctxRef.current;
    if (ctx) {
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = activeTool === "eraser" ? "#FFFFFF" : currentColor;
    }
  }, [lineWidth, currentColor, activeTool]);

  const saveState = () => {
    const canvas = canvasRef.current;
    const imageData = ctxRef.current.getImageData(0, 0, canvas.width, canvas.height);
    setUndoStack((prev) => [...prev, imageData]);
  };

  const undo = () => {
    if (undoStack.length > 0) {
      const ctx = ctxRef.current;
      const lastState = undoStack[undoStack.length - 1];
      ctx.putImageData(lastState, 0, 0);
      setUndoStack((prev) => prev.slice(0, -1));
    }
  };

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvasRef.current.width,
      y: ((e.clientY - rect.top) / rect.height) * canvasRef.current.height,
    };
  };

  const floodFill = (startX, startY, fillColor) => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const stack = [];
    const pixelPos = (x, y) => (y * canvas.width + x) * 4;

    const startIdx = pixelPos(Math.floor(startX), Math.floor(startY));
    const startColor = [
      data[startIdx],
      data[startIdx + 1],
      data[startIdx + 2],
      data[startIdx + 3],
    ];

    const matchColor = (idx) =>
        data[idx] === startColor[0] &&
        data[idx + 1] === startColor[1] &&
        data[idx + 2] === startColor[2] &&
        data[idx + 3] === startColor[3];

    const setPixel = (idx) => {
      data[idx] = fillColor[0];
      data[idx + 1] = fillColor[1];
      data[idx + 2] = fillColor[2];
      data[idx + 3] = 255;
    };

    stack.push([Math.floor(startX), Math.floor(startY)]);

    while (stack.length > 0) {
      const [x, y] = stack.pop();
      const idx = pixelPos(x, y);
      if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) continue;
      if (!matchColor(idx)) continue;
      setPixel(idx);
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
    }
    ctx.putImageData(imageData, 0, 0);
  };

  const startDrawing = (e) => {
    saveState();
    const pos = getMousePos(e);
    if (activeTool === "line") {
      setLineStart(pos);
    } else if (activeTool === "freehand" || activeTool === "eraser") {
      ctxRef.current.globalCompositeOperation =
          activeTool === "eraser" ? "destination-out" : "source-over";
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(pos.x, pos.y);
      setIsDrawing(true);
    } else if (activeTool === "bucket") {
      ctxRef.current.globalCompositeOperation = "source-over";
      const fillColor = hexToRgb(currentColor);
      floodFill(pos.x, pos.y, fillColor);
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getMousePos(e);
    ctxRef.current.lineTo(pos.x, pos.y);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.globalCompositeOperation = "source-over";
    if (activeTool === "line" && lineStart) {
      const pos = getMousePos(event);
      ctxRef.current.beginPath();
      ctxRef.current.moveTo(lineStart.x, lineStart.y);
      ctxRef.current.lineTo(pos.x, pos.y);
      ctxRef.current.stroke();
      setLineStart(null);
    } else if (isDrawing) {
      ctxRef.current.closePath();
      setIsDrawing(false);
    }
  };

  const toggleTool = (toolName) => {
    setActiveTool(activeTool === toolName ? null : toolName);
  };

  const hexToRgb = (hex) => {
    const bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  return (
      <div className="text-gray-900 flex flex-col md:flex-row items-center py-8 justify-center px-4">
        <div className="mt-6 flex flex-col md:flex-row md:gap-6 w-full">
          {/* Left Sidebar */}
          <div className="flex flex-col bg-gray-900 text-white p-1 rounded-lg space-y-4 w-full md:w-auto">
            {/* ... tools */}
            <div className="p-2 bg-gray-900 rounded-md flex items-center justify-center">
              <input
                  type="color"
                  value={currentColor}
                  onChange={(e) => setCurrentColor(e.target.value)}
                  className="w-6 h-6 cursor-pointer"
              />
              <span className="text-white ml-2">Color</span>
            </div>

            {/* ... line width */}
            <div className="p-2 bg-gray-900 rounded-md flex items-center justify-between">
              <span className="text-white">Line Width</span>
              <input
                  type="range"
                  min="1"
                  max="10"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(e.target.value)}
                  className="w-32"
              />
              <span className="text-white ml-2">{lineWidth}</span>
            </div>

            {/* tools */}
            <button
                className="w-full md:w-[300px] bg-primary text-white px-4 py-2 rounded-lg font-fraunces"
                onClick={() => toggleTool("freehand")}
            >
              Freehand Tool
            </button>
            <button
                className="w-full md:w-[300px] bg-primary text-white px-4 py-2 rounded-lg font-fraunces"
                onClick={() => toggleTool("line")}
            >
              Line Tool
            </button>
            <button
                className="w-full md:w-[300px] bg-primary text-white px-4 py-2 rounded-lg font-fraunces"
                onClick={() => toggleTool("bucket")}
            >
              Paint Bucket Tool
            </button>
            <button
                className="w-full md:w-[300px] bg-primary text-white px-4 py-2 rounded-lg font-fraunces"
                onClick={() => toggleTool("eraser")}
            >
              Eraser Tool
            </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 border rounded-lg bg-white shadow-md relative w-full">
            <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                className="rounded-lg border-black border-solid"
            ></canvas>
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-10">
                  <div className="w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full animate-spin mb-4"></div>
                  <span className="text-white text-6xl font-fraunces">Enhancing....</span>
                </div>
            )}

            {/* Clear & Undo Buttons */}
            <div className="absolute bottom-2 right-2 flex gap-2">
              <button
                  className="bg-gray-800 text-white p-2 rounded-md"
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
              <button
                  className="bg-gray-800 text-white p-2 rounded-md"
                  onClick={undo}
              >
                Undo ↩️
              </button>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col space-y-6 w-full md:w-auto">
            {/* textarea and dropdowns */}
            <textarea
                className="border border-black placeholder-gray-500 px-3 py-2 rounded-lg bg-background w-full md:w-[300px] h-[250px] resize-none"
                placeholder="Additional Prompts..."
            ></textarea>

          <DropdownMenu
            id="theme"
            label="Theme"
            options={["Realism", "Minimalism", "Nature"]}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            onThemeChange={handleThemeChange}
          />
          <DropdownMenu
            id="option1"
            label="Option"
            options={["Option 1", "Option 2", "Option 3"]}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />
          <DropdownMenu
            id="option2"
            label="Option"
            options={["Option A", "Option B", "Option C"]}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />

            <div className="pt-8">
              <button
                  className={`w-full md:w-[300px] bg-secondary text-white px-4 py-2 rounded-lg font-fraunces ${
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