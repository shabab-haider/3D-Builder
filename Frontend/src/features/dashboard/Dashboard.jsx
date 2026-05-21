import React, { useState } from "react";
import ProductsNav from "./components/ProductsNav";
import Products from "./components/Products";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("AMERICAN FOOTBALL");

  return (
    <div className="w-full h-screen bg-zinc-200 flex justify-center items-center overflow-hidden">
      <div className="w-full max-w-400 h-full flex bg-zinc-100 border-x border-zinc-250 shadow-[0_0_80px_rgba(0,0,0,0.06)] relative overflow-hidden">
        <ProductsNav 
          selectedCategory={selectedCategory} 
          setSelectedCategory={setSelectedCategory} 
        />
        <Products selectedCategory={selectedCategory} />
      </div>
    </div>
  );
};

export default Dashboard;
