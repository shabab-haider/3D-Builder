import React, { useContext } from "react";
import { dashboardDataContext } from "../state/dashboard.context";

const categories = [
  { id: "AMERICAN FOOTBALL", label: "AMERICAN FOOTBALL", items: 2 },
  { id: "BASEBALL", label: "BASEBALL", items: 2 },
  { id: "BASKETBALL", label: "BASKETBALL", items: 2 },
  { id: "ICE HOCKEY", label: "ICE HOCKEY", items: 1 },
  { id: "LACROSSE", label: "LACROSSE", items: 6 },
  { id: "SOCCER", label: "SOCCER", items: 2 },
  { id: "SOFTBALL", label: "SOFTBALL", items: 2 },
  { id: "SPORTS WEARS", label: "SPORTS WEARS", items: 5 },
];

const ProductsNav = () => {
  const { products, setProducts } = useContext(dashboardDataContext);

  return (
    <div className="flex flex-col h-full w-64 bg-zinc-50 border-r border-zinc-200 shrink-0 font-mono select-none">
      {/* File Browser Title Block */}
      <div className="p-4 border-b border-zinc-200 bg-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="text-xs font-bold text-zinc-700 tracking-tight">ASSET_LIBRARY</span>
        </div>
        <span className="text-[10px] text-zinc-400 bg-zinc-200 px-1.5 py-0.5 rounded font-mono">v1.0.4</span>
      </div>

      <div className="p-3 border-b border-zinc-200 bg-zinc-50/50">
        <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
          Collections Directory
        </span>
      </div>

      {/* Directory items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5 custom-scrollbar">
        {categories.map((cat) => {
          const isSelected = products === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setProducts(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded text-left transition-all duration-150 border text-[11px] font-medium cursor-pointer group
                ${
                  isSelected
                    ? "bg-zinc-200 border-zinc-300 text-zinc-950 font-bold"
                    : "bg-transparent border-transparent text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800"
                }
              `}
            >
              <div className="flex items-center gap-2 truncate">
                {/* Folder icon */}
                <svg
                  className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-zinc-700" : "text-zinc-400 group-hover:text-zinc-600"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                </svg>
                <span className="truncate tracking-tight uppercase">{cat.label}</span>
              </div>

              {/* Item count badge */}
              <span
                className={`text-[9px] font-mono px-1 rounded transition-colors ${
                  isSelected ? "bg-zinc-300 text-zinc-800" : "bg-zinc-200 text-zinc-400 group-hover:bg-zinc-200 group-hover:text-zinc-600"
                }`}
              >
                {cat.items}
              </span>
            </button>
          );
        })}
      </div>

      {/* System Status Footer */}
      <div className="p-3 border-t border-zinc-200 bg-zinc-100 flex items-center gap-2 text-[10px] text-zinc-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span>ENGINE_CONNECTED</span>
      </div>
    </div>
  );
};

export default ProductsNav;
