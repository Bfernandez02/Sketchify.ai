import React, { useRef, useState, useEffect } from "react";

const SketchPad = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const scale = window.devicePixelRatio || 1;
    canvas.width = 800 * scale;
    canvas.height = 500 * scale;
    canvas.style.width = "800px";
    canvas.style.height = "500px";
    
    ctx.scale(scale, scale);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
  
    ctxRef.current = ctx;
  }, []);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  return (
    <div className="min-h-screen text-gray-900 flex flex-col items-center py-8 ">
      
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
            className="w-[800px] h-[500px] rounded-lg"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
          ></canvas>
          <button className="absolute bottom-2 right-2 bg-gray-800 text-white p-2 rounded-md" onClick={() => ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)}>
            Clear 🔲
          </button>
        </div>

        {/* Options Panel */}
        <div className="flex flex-col space-y-4">
          <textarea
            className="border p-2 rounded-md w-48"
            placeholder="Additional prompts..."
          ></textarea>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
            Theme ⬇
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
            Option ⬇
          </button>
          <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
            Option ⬇
          </button>
        </div>
      </div>

      <button className="mt-6 bg-orange-500 text-white px-60 py-2 rounded-md ">
        Enhance ✨
      </button>
    </div>
  );
};

export default SketchPad;
