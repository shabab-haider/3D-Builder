import { useContext, useState } from "react";
import { dashboardDataContext } from "../state/dashboard.context";
import { getDesignsAPI, deleteDesignAPI } from "../api/dashboard.api";
import { useNavigate } from "react-router-dom";

export const useDashboard = () => {
  const navigate = useNavigate();
  const {
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
  } = useContext(dashboardDataContext);

  const [loading, setLoading] = useState(false);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const response = await getDesignsAPI();
      if (response.data && response.data.success) {
        setDesigns(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDesign = async (id) => {
    try {
      const response = await deleteDesignAPI(id);
      if (response.data && response.data.success) {
        setDesigns((prev) => prev.filter((design) => design._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete design:", error);
    }
  };

  const loadDesign = (design) => {
    setProducts(design.productCategory || "CUSTOM_DESIGN");
    setModel(design.modelPath);
    setPartColors(design.partColors || {});
    setTextList(design.textList || []);
    setLogoList(design.logoList || []);
    navigate("/builder");
  };

  return {
    designs,
    loading,
    fetchDesigns,
    deleteDesign,
    loadDesign,
  };
};
