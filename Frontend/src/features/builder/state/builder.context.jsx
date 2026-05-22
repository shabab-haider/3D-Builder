import React, { createContext, useState, useEffect } from "react";

export const builderContext = createContext();

const BuilderContextProvider = ({ children }) => {
  // Current text properties (active item or last added)
  const [text, setText] = useState("");
  const [textColor, setTextColor] = useState("#111827");
  const [textPosition, setTextPosition] = useState([0, 0, 0.02]);
  const [textQuaternion, setTextQuaternion] = useState([0, 0, 0, 1]);
  const [textSize, setTextSize] = useState(0.35);
  const [textRotation, setTextRotation] = useState(0);

  // Current logo properties
  const [logoUrl, setLogoUrl] = useState("");
  const [logoSize, setLogoSize] = useState(0.4);
  const [logoPosition, setLogoPosition] = useState([0, 0, 0.02]);
  const [logoQuaternion, setLogoQuaternion] = useState([0, 0, 0, 1]);
  const [logoRotation, setLogoRotation] = useState(0);

  // Mesh the active overlay is placed on
  const [targetMesh, setTargetMesh] = useState("");

  // All uploaded / added items
  const [textList, setTextList] = useState(() => {
    try {
      const stored = localStorage.getItem("builder_text_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [logoList, setLogoList] = useState(() => {
    try {
      const stored = localStorage.getItem("builder_logo_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("builder_text_list", JSON.stringify(textList));
  }, [textList]);

  useEffect(() => {
    localStorage.setItem("builder_logo_list", JSON.stringify(logoList));
  }, [logoList]);

  // Selection & drag
  const [selectedId, setSelectedId] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // "text" | "logo"
  const [isDragging, setIsDragging] = useState(false);

  // Mesh names from loaded model (for biggest-mesh placement)
  const [meshNames, setMeshNames] = useState([]);

  // Loaded GLTF scene (for placement helpers in sidebar)
  const [modelScene, setModelScene] = useState(null);

  return (
    <builderContext.Provider
      value={{
        text,
        setText,
        textColor,
        setTextColor,
        textPosition,
        setTextPosition,
        textQuaternion,
        setTextQuaternion,
        textSize,
        setTextSize,
        textRotation,
        setTextRotation,
        logoUrl,
        setLogoUrl,
        logoSize,
        setLogoSize,
        logoPosition,
        setLogoPosition,
        logoQuaternion,
        setLogoQuaternion,
        logoRotation,
        setLogoRotation,
        targetMesh,
        setTargetMesh,
        textList,
        setTextList,
        logoList,
        setLogoList,
        selectedId,
        setSelectedId,
        selectedType,
        setSelectedType,
        isDragging,
        setIsDragging,
        meshNames,
        setMeshNames,
        modelScene,
        setModelScene,
      }}
    >
      {children}
    </builderContext.Provider>
  );
};

export default BuilderContextProvider;
