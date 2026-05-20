import React, { useContext } from "react";
import { dashboardDataContext } from "../state/dashboard.context";

const categories = [
  "AMERICAN FOOTBALL",
  "BASEBALL",
  "BASKETBALL",
  "ICE HOCKEY",
  "LACROSSE",
  "SOCCER",
  "SOFTBALL",
  "SPORTS WEARS",
];

const ProductsNav = () => {
  const { products, setProducts } = useContext(dashboardDataContext);
  return (
    <div className="flex flex-col h-full w-1/4 bg-white border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
      <div className="p-8 pb-4">
        <h2 className="text-sm font-bold tracking-[0.2em] text-gray-400 uppercase mb-2">
          Collections
        </h2>
        <div className="w-8 h-1 bg-black rounded-full"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-1 custom-scrollbar">
        {categories.map((category) => {
          const isSelected = products === category;
          return (
            <button
              key={category}
              onClick={() => {
                setProducts(category);
                setProducts(category);
              }}
              className={`group w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ease-out font-medium text-sm tracking-wide
                ${
                  isSelected
                    ? "bg-black text-white shadow-md transform scale-[1.02]"
                    : "bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1"
                }
              `}
            >
              <span>{category}</span>
              {/* Optional tiny indicator arrow on hover/select */}
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProductsNav;
