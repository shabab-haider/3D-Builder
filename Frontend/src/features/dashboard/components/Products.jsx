import React, { useContext, useState } from "react";
import { dashboardDataContext } from "../state/dashboard.context";
import { useNavigate } from "react-router-dom";
import { uploadToCloudinary } from "../../builder/utils/cloudinaryUpload";

const Products = () => {
  const navigate = useNavigate();
  const { products, setProducts, setModel, setPartColors } = useContext(dashboardDataContext);
  const [uploading, setUploading] = useState(false);

  const handleGlbUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    try {
      const { url } = await uploadToCloudinary(file);
      setProducts("CUSTOM_DESIGN");
      setModel(url);
      setPartColors({});
      navigate("/builder");
    } catch (err) {
      console.error("GLB upload failed:", err);
      alert("Failed to upload GLB model: " + err.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };
  const ProductData = [
    {
      folderName: "AMERICAN FOOTBALL",
      images: [
        "/Product Images/AMERICAN FOOTBALL/FLAG FOOTBALL JERSEY.png",
        "/Product Images/AMERICAN FOOTBALL/AMERICAN FOOTBALL JERSEY.png",
      ],
    },
    {
      folderName: "BASEBALL",
      images: [
        "/Product Images/BASEBALL/CREW NECK JERSEYS.png",
        "/Product Images/BASEBALL/FULL BUTTON JERSEY.png",
      ],
    },
    {
      folderName: "BASKETBALL",
      images: [
        "/Product Images/BASKETBALL/SINGLE BASKETBALL V NECK.png",
        "/Product Images/BASKETBALL/SINGLE SHORTS.png",
      ],
    },
    {
      folderName: "ICE HOCKEY",
      images: ["/Product Images/ICE HOCKEY/JERSEYS.png"],
    },
    {
      folderName: "SOCCER",
      images: [
        "/Product Images/SOCCER/JERSEYS.png",
        "/Product Images/SOCCER/SHORTS.png",
      ],
    },
    {
      folderName: "LACROSSE",
      images: [
        "/Product Images/LACROSSE/JERSEY.png",
        "/Product Images/LACROSSE/SHORTS.png",
        "/Product Images/LACROSSE/WOMEN SHORTS.png",
        "/Product Images/LACROSSE/TANKTOP PINIES.png",
        "/Product Images/LACROSSE/WOMEN TANKTOPS.png",
      ],
    },
    {
      folderName: "SOFTBALL",
      images: [
        "/Product Images/SOFTBALL/CREW NECK JERSEYS.png",
        "/Product Images/SOFTBALL/SHORTS.png",
      ],
    },
    {
      folderName: "SPORTS WEARS",
      images: [
        "/Product Images/SPORTS WEARS/HODIES SHIRTS SHOTING SHIRTS.png",
        "/Product Images/SPORTS WEARS/HODIES.png",
        "/Product Images/SPORTS WEARS/POLO SHIRTS.png",
        "/Product Images/SPORTS WEARS/PULL OVER LONG SLEEVES.png",
        "/Product Images/SPORTS WEARS/SLEEVELESS HODIES.png",
      ],
    },
  ];

  return (
    <div className="h-full w-3/4 bg-zinc-100 tech-grid flex flex-col relative overflow-hidden font-mono">
      {/* File Browser Header */}
      <div className="px-10 pt-10 pb-4 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
        <h1 className="text-2xl font-black text-zinc-800 tracking-tight uppercase">
          {products}
        </h1>
        <div className="flex items-center gap-3">
          <label className={`flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-[10px] font-bold uppercase cursor-pointer rounded-xs transition-colors ${uploading ? "opacity-50 pointer-events-none" : ""}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>{uploading ? "Uploading GLB..." : "Upload GLB"}</span>
            <input
              type="file"
              accept=".glb"
              className="hidden"
              onChange={handleGlbUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      {/* Asset Grid Panel */}
      <div className="flex-1 px-10 py-8 overflow-y-auto flex flex-col custom-scrollbar">
        {(() => {
          // 1. Current active category data
          const activeCategory = ProductData.find(
            (item) => item.folderName.toUpperCase() === products?.toUpperCase(),
          );

          // 2. If match not found show empty/not found state
          if (!activeCategory) {
            return (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-zinc-50 p-8 rounded text-center max-w-lg mx-auto my-auto">
                {products === "CUSTOM_DESIGN" ? (
                  <>
                    <p className="text-zinc-500 font-bold text-xs uppercase mb-1">
                      [SYS] CUSTOM_DESIGN_ACTIVE
                    </p>
                    <p className="text-zinc-400 text-[10px] leading-relaxed">
                      A custom 3D model is currently loaded in the builder workspace. 
                      Select a standard collection from the Collections Directory on the left to start a new design or browse catalog assets.
                    </p>
                  </>
                ) : (
                  <p className="text-zinc-400 font-medium text-xs">
                    [ERR_NO_ASSETS] No product items cataloged for category: "{products}"
                  </p>
                )}
              </div>
            );
          }

          // 3. Render asset cards
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {activeCategory.images.map((imagePath, index) => {
                const fileName = imagePath
                  .split("/")
                  .pop()
                  .replace(/\.[^/.]+$/, "");

                return (
                  <div
                    onClick={() => {
                      const glbPath = `/PRODUCTS/${products}/${fileName}.glb`;
                      setModel(glbPath);
                      setPartColors({}); // Reset custom colors for the new model
                      navigate("/builder");
                    }}
                    key={index}
                    className="bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden flex flex-col cursor-pointer hover:border-zinc-400 hover:shadow-sm active:scale-99 transition-all select-none group"
                  >
                    {/* Visual Asset Thumbnail */}
                    <div className="h-40 bg-white flex items-center justify-center p-4 border-b border-zinc-200 relative">
                      <span className="absolute top-2 left-2 text-[9px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 px-1.5 rounded">
                        .GLB
                      </span>
                      <img
                        src={imagePath}
                        alt={fileName}
                        className="max-w-full max-h-full object-contain filter drop-shadow-xs transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "https://placehold.co";
                        }}
                      />
                    </div>

                    {/* Technical metadata */}
                    <div className="p-3 flex-1 flex flex-col justify-between gap-3">
                      <h3 className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight truncate" title={fileName}>
                        {fileName}
                      </h3>
                      {/* Action Button */}
                      <button className="w-full py-1.5 border border-zinc-200 group-hover:border-zinc-400 group-hover:bg-zinc-150 transition-colors text-[9px] font-bold text-zinc-600 text-center uppercase cursor-pointer rounded-xs">
                        Load in Viewport
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Products;
