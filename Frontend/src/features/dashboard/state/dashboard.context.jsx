import React, { createContext, useState } from "react";
export const dashboardDataContext = createContext();

const DashboardContext = ({ children }) => {
  const [products, setProducts] = useState("AMERICAN FOOTBALL");
  const [model, setModel] = useState("");
  const [partColors, setPartColors] = useState({});
  const [textList, setTextList] = useState([]);
  const [logoList, setLogoList] = useState([]);
  const [designs, setDesigns] = useState([]);

  return (
    <dashboardDataContext.Provider
      value={{
        products,
        setProducts,
        model,
        setModel,
        partColors,
        setPartColors,
        textList,
        setTextList,
        logoList,
        setLogoList,
        designs,
        setDesigns,
      }}
    >
      {children}
    </dashboardDataContext.Provider>
  );
};

export default DashboardContext;

