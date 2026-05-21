import React, { createContext, useState, useEffect } from "react";
export const dashboardDataContext = createContext();

const DashboardContext = ({ children }) => {
  const [products, setProducts] = useState(() => {
    return localStorage.getItem("builder_products") || "AMERICAN FOOTBALL";
  });
  const [model, setModel] = useState(() => {
    return localStorage.getItem("builder_model") || "";
  });
  const [partColors, setPartColors] = useState(() => {
    try {
      const stored = localStorage.getItem("builder_part_colors");
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("builder_products", products);
  }, [products]);

  useEffect(() => {
    localStorage.setItem("builder_model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("builder_part_colors", JSON.stringify(partColors));
  }, [partColors]);

  return (
    <dashboardDataContext.Provider
      value={{
        products,
        setProducts,
        model,
        setModel,
        partColors,
        setPartColors,
      }}
    >
      {children}
    </dashboardDataContext.Provider>
  );
};

export default DashboardContext;
