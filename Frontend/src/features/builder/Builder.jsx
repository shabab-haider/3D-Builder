import React from "react";
import ProductCanvas from "./canvas/ProductCanvas";

const Builder = () => {
    return (
      <div className="relative w-screen h-screen overflow-hidden">
        <ProductCanvas />
      </div>
    );
};

export default Builder;
