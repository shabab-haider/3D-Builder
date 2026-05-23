import { useContext } from "react";
import { dashboardDataContext } from "../../dashboard/state/dashboard.context";
import { builderContext } from "../state/builder.context";
import { saveDesignAPI } from "../api/builder.api";

export const useBuilder = () => {
  const {
    setProducts,
    setModel,
    setPartColors,
    setTextList: setDashboardTextList,
    setLogoList: setDashboardLogoList,
  } = useContext(dashboardDataContext);
  const { setTextList, setLogoList, loading, setLoading } =
    useContext(builderContext);

  const saveDesign = async (designData) => {
    setLoading(true);
    try {
      console.log(designData);
      const res = await saveDesignAPI(designData);
      console.log(res);
      // Update global context states
      setProducts(designData.productCategory);
      setModel(designData.modelPath);
      setPartColors(designData.partColors);
      setTextList(designData.textList);
      setLogoList(designData.logoList);
      setDashboardTextList(designData.textList);
      setDashboardLogoList(designData.logoList);

      console.log("Saving design configuration:", designData);

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
