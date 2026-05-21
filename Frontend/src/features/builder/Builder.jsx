import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProductCanvas from "./canvas/ProductCanvas";
import PartsList from "./components/PartsList";
import ColorPalette from "./components/ColorPalette";
import { dashboardDataContext } from "../dashboard/state/dashboard.context";

const Builder = () => {
  const navigate = useNavigate();
  const { model, products, partColors, setPartColors } = useContext(dashboardDataContext);
  
  const [parts, setParts] = useState([]);
  const [selectedPart, setSelectedPart] = useState(null);
  const [originalColors, setOriginalColors] = useState({});

  // Extract model display name
  const modelName = model
    ? model.split("/").pop().replace(".glb", "")
    : "CUSTOM_DESIGN";

  const handlePartsDetected = (detectedParts, initialColors) => {
    setParts(detectedParts);
    setOriginalColors(initialColors);
    
    // Merge original model colors with saved customizations (local storage overrides)
    setPartColors((prev) => {
      return {
        ...initialColors,
        ...prev,
      };
    });

    // Auto select first part if none is selected
    if (detectedParts.length > 0 && !selectedPart) {
      setSelectedPart(detectedParts[0]);
    }
  };

  const handleColorSelect = (color) => {
    if (selectedPart) {
      setPartColors((prev) => ({
        ...prev,
        [selectedPart]: color,
      }));
    }
  };

  const handleResetColors = () => {
    setPartColors(originalColors);
  };

  const handleExportDesign = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${modelName.replace(/\s+/g, "_")}_design.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-200 flex justify-center items-center overflow-hidden font-mono select-none text-xs text-zinc-700">
      <div className="w-full max-w-400 h-full flex bg-zinc-100 border-x border-zinc-250 shadow-[0_0_80px_rgba(0,0,0,0.06)] relative overflow-hidden">
        
        {/* 1. LEFT SIDEBAR: OUTLINER / EXPLORER PANEL */}
        <div className="w-64 h-full bg-zinc-50 border-r border-zinc-200 flex flex-col shrink-0">
        {/* Back navigation & workspace info */}
        <div className="p-4 border-b border-zinc-200 bg-zinc-100 flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-zinc-800 transition-colors group cursor-pointer w-fit"
          >
            <svg
              className="w-3.5 h-3.5 transform group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            BACK_TO_LIBRARY
          </button>
          
          <div>
            <div className="text-[9px] text-zinc-400 font-bold uppercase tracking-tight truncate">
              {products}
            </div>
            <h1 className="text-sm font-black text-zinc-800 tracking-tight mt-0.5 uppercase truncate">
              {modelName}
            </h1>
          </div>
        </div>

        {/* Tree Outliner content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <PartsList
            parts={parts}
            partColors={partColors}
            selectedPart={selectedPart}
            onPartSelect={setSelectedPart}
          />
        </div>

        {/* Left footer: stats info */}
        <div className="p-3 border-t border-zinc-200 bg-zinc-100/50 flex flex-col gap-1 text-[9px] text-zinc-400">
          <div>MESH_COUNT: <span className="text-zinc-600 font-bold">{parts.length}</span></div>
          <div>STATUS: <span className="text-green-600 font-bold">READY</span></div>
        </div>
      </div>

      {/* 2. CENTER PANEL: 3D VIEWPORT */}
      <div className="flex-1 h-full relative bg-zinc-200 flex flex-col">
        {/* Viewport bar */}
        <div className="absolute top-0 inset-x-0 h-9 bg-zinc-50/75 backdrop-blur-md border-b border-zinc-200 z-10 px-4 flex items-center justify-between text-[10px] text-zinc-400 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              3D_VIEWPORT
            </span>
          </div>
        </div>

        {/* WebGL Canvas container */}
        <div className="flex-1 h-full tech-dot-grid">
          <ProductCanvas
            selectedPart={selectedPart}
            setSelectedPart={setSelectedPart}
            onPartsDetected={handlePartsDetected}
          />
        </div>

        {/* Dynamic tips card overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-zinc-900/90 backdrop-blur-sm px-3.5 py-2.5 rounded border border-zinc-800 shadow-md pointer-events-none z-10 flex items-center gap-2 max-w-md">
          <div className="w-4 h-4 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[9px]">
            i
          </div>
          <p className="text-[10px] text-zinc-400 leading-tight">
            Click directly on any model part in 3D to select it, or drag to rotate camera.
          </p>
        </div>
      </div>

      {/* 3. RIGHT SIDEBAR: INSPECTOR PANEL */}
      <div className="w-72 h-full bg-zinc-50 border-l border-zinc-200 flex flex-col shrink-0 justify-between">
        
        <div className="flex flex-col flex-1 min-h-0">
          {/* Inspector Header */}
          <div className="p-4 border-b border-zinc-200 bg-zinc-100 flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            <span className="text-xs font-bold text-zinc-700">PROPERTIES_INSPECTOR</span>
          </div>

          {/* Properties Scrollable section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
            {/* Active mesh target details */}
            <div className="space-y-2">
              <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
                Active Selection
              </span>
              <div className="p-3 bg-zinc-100 border border-zinc-200 rounded flex flex-col gap-1.5 font-mono text-[10px]">
                <div className="flex justify-between">
                  <span className="text-zinc-400">OBJECT_ID:</span>
                  <span className="text-zinc-700 font-bold truncate max-w-35 uppercase">
                    {selectedPart || "NONE"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">MATERIAL:</span>
                  <span className="text-zinc-500">mesh_standard_mat</span>
                </div>
              </div>
            </div>

            {/* Custom Color Selector */}
            <ColorPalette
              selectedPart={selectedPart}
              partColors={partColors}
              onColorSelect={handleColorSelect}
            />
          </div>
        </div>

        {/* Exporter actions footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-100 flex flex-col gap-2">
          <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase mb-0.5">
            Output Controls
          </span>

          <button
            onClick={handleResetColors}
            disabled={parts.length === 0}
            className="w-full flex items-center justify-center gap-1.5 py-2 border border-zinc-200 hover:border-zinc-300 bg-white text-[10px] font-bold text-zinc-600 hover:text-zinc-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs rounded-xs font-mono"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3m0 0l3 3m-3-3v12" />
            </svg>
            RESET DESIGN
          </button>

          <button
            onClick={handleExportDesign}
            disabled={parts.length === 0}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-[10px] font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm rounded-xs font-mono"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            EXPORT IMAGE
          </button>
        </div>

      </div>
    </div>
  </div>
  );
};

export default Builder;
