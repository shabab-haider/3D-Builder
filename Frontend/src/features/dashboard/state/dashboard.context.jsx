import React, { createContext, useState } from "react";
export const dashboardDataContext = createContext();

const DashboardContext = ({ children }) => {
  const [products, setProducts] = useState("AMERICAN FOOTBALL");
  const [model, setModel] = useState("");
  return (
    <dashboardDataContext.Provider
      value={{ products, setProducts, model, setModel }}
    >
      {children}
    </dashboardDataContext.Provider>
  );
};

export default DashboardContext;
