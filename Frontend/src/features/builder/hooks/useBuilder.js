import { useContext } from "react";
import { dashboardDataContext } from "../../dashboard/state/dashboard.context";
import { builderContext } from "../state/builder.context";

export const useBuilder = () => {
  const { setProducts, setModel, setPartColors } =
    useContext(dashboardDataContext);
  const { setTextList, setLogoList, loading, setLoading } =
    useContext(builderContext);

  const saveDesign = async (designData) => {
    setLoading(true);
    try {
      // Update global context states
      setProducts(designData.productCategory);
      setModel(designData.modelPath);
      setPartColors(designData.partColors);
      setTextList(designData.textList);
      setLogoList(designData.logoList);

      console.log("Saving design configuration:", designData);

      // TODO: Integrate backend API call here

      alert("Design configuration saved successfully!");
    } catch (err) {
      console.error("Save design error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    saveDesign,
    loading,
  };
};
