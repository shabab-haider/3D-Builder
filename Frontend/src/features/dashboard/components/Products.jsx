import React, { useContext } from "react";
import { dashboardDataContext } from "../state/dashboard.context";
import { useNavigate } from "react-router-dom";

const Products = () => {
  const navigate = useNavigate();
  const { products, setModel } = useContext(dashboardDataContext);
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
        "/Product Images/SOCCER/SOCCER Jerseys.png",
        "/Product Images/SOCCER/SOCCER Shorts.png",
      ],
    },
    {
      folderName: "LACROSSE",
      images: [
        "/Product Images/LACROSSE/LACROSSE Jersey.png",
        "/Product Images/LACROSSE/SHORTS.png",
        "/Product Images/LACROSSE/WOMEN SHORTS.png",
        "/Product Images/LACROSSE/TANKTOP PINIES.png",
        "/Product Images/LACROSSE/WOMEN TANKTOPS.png",
      ],
    },
    {
      folderName: "SOFTBALL",
      images: [
        "/Product Images/SOFTBALL/SOFTBALL Crew Neck Jerseys.png",
        "/Product Images/SOFTBALL/SOFTBALL Shorts.png",
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
    <div className="h-full w-3/4 bg-[#f8f9fa] flex flex-col relative overflow-hidden">
      {/* Subtle background decorative blob */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-50 opacity-50 blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="px-12 pt-12 pb-6 z-10">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {products}
        </h1>
        <p className="text-gray-500 mt-2 text-sm font-medium">
          Explore our premium collection of {products.toLowerCase()}.
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 px-12 pb-12 z-10 flex flex-col overflow-y-auto">
        {" "}
        {/* Added overflow-y-auto to allow scrolling */}
        {(() => {
          // 1. Current active category data
          const activeCategory = ProductData.find(
            (item) => item.folderName.toUpperCase() === products?.toUpperCase(),
          );

          // 2. If match not found show empty/not found state
          if (!activeCategory) {
            return (
              <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl bg-white shadow-sm p-8">
                <p className="text-gray-400 font-medium text-lg">
                  No product images found for "{products}"
                </p>
              </div>
            );
          }

          // 3. match = image cards
          return (
            <div className="flex-1 border border-dashed border-gray-300 rounded-2xl bg-white shadow-sm p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
                {activeCategory.images.map((imagePath, index) => {
                  // Image ke path se clean naam nikalne ke liye logic
                  const fileName = imagePath
                    .split("/")
                    .pop()
                    .replace(/\.[^/.]+$/, "");

                  return (
                    <div
                      onClick={() => {
                              const requireName = fileName.toLowerCase().replace(/\s+/g, "");
                              console.log(requireName);
                        setModel(requireName);
                        navigate("/builder");
                      }}
                      key={index}
                      className="bg-[#f8f9fa] rounded-xl border border-gray-100 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
                    >
                      {/* Image Box */}
                      <div className="h-48 bg-white flex items-center justify-center p-4 border-b border-gray-100">
                        <img
                          src={imagePath}
                          alt={fileName}
                          className="max-w-full max-h-full object-contain"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "https://placehold.co";
                          }}
                        />
                      </div>

                      {/* Text Details */}
                      <div className="p-3 bg-white flex-1 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide truncate">
                          {fileName}
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default Products;
