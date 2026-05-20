import React, { useState } from "react";
import ProductsNav from "./components/ProductsNav";
import Products from "./components/Products";

const Dashboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("AMERICAN FOOTBALL");

  return (
    <div className="flex w-screen h-screen">
      <ProductsNav 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />
      <Products selectedCategory={selectedCategory} />
    </div>
  );
};

export default Dashboard;
