import React from "react";

const PRESET_COLORS = [
  { name: "White", value: "#FFFFFF" },
  { name: "Light Grey", value: "#CBD5E1" },
  { name: "Slate Grey", value: "#475569" },
  { name: "Charcoal", value: "#1E293B" },
  { name: "Black", value: "#111827" },
  { name: "Crimson Red", value: "#EF4444" },
  { name: "Vibrant Orange", value: "#F97316" },
  { name: "Amber Yellow", value: "#F59E0B" },
  { name: "Forest Green", value: "#15803D" },
  { name: "Emerald Green", value: "#10B981" },
  { name: "Teal Blue", value: "#14B8A6" },
  { name: "Sky Blue", value: "#0EA5E9" },
  { name: "Royal Blue", value: "#3B82F6" },
  { name: "Navy Blue", value: "#1E3A8A" },
  { name: "Indigo Purple", value: "#6366F1" },
  { name: "Vibrant Pink", value: "#EC4899" },
];

const ColorPalette = ({ selectedPart, partColors, onColorSelect }) => {
  const currentColor = selectedPart ? (partColors[selectedPart] || "#FFFFFF") : null;

  return (
    <div className="flex flex-col gap-3 font-mono text-[10px]">
      <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
        Material Properties
      </span>

      {!selectedPart ? (
        <div className="p-4 text-center text-zinc-400 border border-dashed border-zinc-200 bg-zinc-50/50">
          [WARN] SELECT_PART_TO_INSPECT
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Hex field input & preview */}
          <div className="space-y-1.5">
            <span className="text-zinc-400">DIFFUSE_COLOR</span>
            <div className="flex items-center gap-2 bg-zinc-150 p-2 border border-zinc-200 rounded-sm relative">
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorSelect(e.target.value.toUpperCase())}
                className="w-6 h-6 border border-zinc-300 rounded-xs cursor-pointer p-0 bg-transparent"
              />
              <div className="flex-1 flex justify-between items-center ml-1">
                <span className="font-bold text-zinc-700">{currentColor.toUpperCase()}</span>
                <span className="text-[8px] text-zinc-400 uppercase">HEX_COLOR_PICKER</span>
              </div>
            </div>
          </div>

          {/* Preset Color Swatches Header */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>COLOR_SWATCHES</span>
              <span>16_PRESETS</span>
            </div>
            
            <div className="grid grid-cols-6 gap-1.5">
              {PRESET_COLORS.map((color) => {
                const isActive = currentColor?.toUpperCase() === color.value.toUpperCase();
                return (
                  <button
                    key={color.value}
                    onClick={() => onColorSelect(color.value)}
                    className={`relative aspect-square rounded-xs border cursor-pointer transition-all duration-100 flex items-center justify-center active:scale-90
                      ${
                        isActive
                          ? "border-zinc-900 ring-1 ring-zinc-900/50 scale-102"
                          : "border-zinc-200 hover:border-zinc-400"
                      }
                    `}
                    style={{ backgroundColor: color.value }}
                    title={`${color.name}: ${color.value}`}
                  >
                    {/* Contrast Indicator Dot */}
                    {isActive && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full shadow-xs ${
                          color.value === "#FFFFFF" ? "bg-zinc-800" : "bg-white"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default ColorPalette;
