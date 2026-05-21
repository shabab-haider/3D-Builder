import React from "react";

const formatPartName = (name) => {
  if (!name) return "UNNAMED_MESH";
  // Convert delimiters and uppercase for technical feel
  return name.replace(/[_-]/g, "_").toUpperCase();
};

const PartsList = ({ parts, partColors, selectedPart, onPartSelect }) => {
  if (!parts || parts.length === 0) {
    return (
      <div className="py-6 text-center text-[10px] font-mono text-zinc-400 border border-dashed border-zinc-200 bg-zinc-50/50">
        [SYS] TRAVERSING_SCENE_GRAPH...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 font-mono text-[10px]">
      <div className="flex items-center justify-between pb-1.5 border-b border-zinc-200">
        <span className="font-bold text-zinc-400 uppercase tracking-tight">
          Scene outliner ({parts.length})
        </span>
        <span className="text-[9px] text-zinc-400 font-bold bg-zinc-200 px-1 rounded">
          glb_tree
        </span>
      </div>

      <div className="max-h-95 overflow-y-auto pr-1.5 space-y-0.5 custom-scrollbar select-none">
        {parts.map((part, index) => {
          const isSelected = part === selectedPart;
          const color = partColors[part] || "#FFFFFF";
          const formattedIndex = String(index).padStart(2, "0");

          return (
            <button
              key={part}
              onClick={() => onPartSelect(part)}
              className={`w-full flex items-center justify-between px-2 py-1.5 border text-left transition-all duration-100 cursor-pointer rounded-xs
                ${
                  isSelected
                    ? "bg-zinc-200 border-zinc-300 text-zinc-950 font-bold"
                    : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                }
              `}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                {/* Outliner tree line indicator */}
                <span className="text-zinc-300 font-normal">
                  {formattedIndex}
                </span>

                {/* Technical Mesh Icon */}
                <svg
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isSelected ? "text-zinc-700" : "text-zinc-400"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>

                <span className="truncate font-mono tracking-tight font-medium">
                  {formatPartName(part)}
                </span>
              </div>
              
              <div className="flex items-center gap-2 shrink-0">
                {/* Tiny color indicator bubble */}
                <span
                  className="w-3.5 h-3.5 rounded-sm border border-zinc-300 shadow-inner shrink-0"
                  style={{ backgroundColor: color }}
                  title={`Color: ${color}`}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PartsList;
