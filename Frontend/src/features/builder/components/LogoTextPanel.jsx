import React, { useContext, useState, useEffect } from "react";
import { builderContext } from "../state/builder.context";
import ColorPalette from "./ColorPalette";
import { uploadToCloudinary } from "../utils/cloudinaryUpload";
import {
  findMeshByName,
  getBiggestMeshName,
  getPlacementOnMesh,
} from "../utils/meshHelpers";

const LogoTextPanel = () => {
  const {
    modelScene: scene,
    text,
    setText,
    setTextColor,
    setTextPosition,
    setTextSize,
    setLogoUrl,
    setLogoSize,
    setLogoPosition,
    setTargetMesh,
    textList,
    setTextList,
    logoList,
    setLogoList,
    selectedId,
    setSelectedId,
    selectedType,
    setSelectedType,
    textSize,
    logoSize,
    textColor,
  } = useContext(builderContext);

  const [textInput, setTextInput] = useState("");
  const [editTextInput, setEditTextInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (selectedType === "text" && selectedId) {
      const item = textList.find((t) => t.id === selectedId);
      setEditTextInput(item?.text || text || "");
    } else {
      setEditTextInput("");
    }
  }, [selectedId, selectedType, textList, text]);

  const pickMeshAndPlacement = () => {
    if (!scene) {
      return {
        meshName: "",
        position: [0, 0, 0.02],
        quaternion: [0, 0, 0, 1],
        size: 0.12,
      };
    }
    const meshName = getBiggestMeshName(scene) || "";
    const mesh = findMeshByName(scene, meshName);
    const placement = mesh
      ? getPlacementOnMesh(mesh)
      : { position: [0, 0, 0.02], quaternion: [0, 0, 0, 1] };
    const size = 0.12;
    return { meshName, ...placement, size };
  };

  const selectTextItem = (item) => {
    setSelectedId(item.id);
    setSelectedType("text");
    setText(item.text);
    setTextColor(item.color);
    setTextPosition(item.position);
    setTextSize(item.size);
    setTargetMesh(item.mesh);
  };

  const selectLogoItem = (item) => {
    setSelectedId(item.id);
    setSelectedType("logo");
    setLogoUrl(item.url);
    setLogoPosition(item.position);
    setLogoSize(item.size);
    setTargetMesh(item.mesh);
  };

  const handleAddText = () => {
    const value = textInput.trim();
    if (!value) return;
    if (!scene) {
      setError("Wait for the 3D model to load first.");
      return;
    }
    setError("");

    const { meshName, position, quaternion, size } = pickMeshAndPlacement();
    const color = "#111827";
    const id = `text-${Date.now()}`;

    const item = {
      id,
      name: value,
      text: value,
      color,
      position,
      quaternion,
      size,
      mesh: meshName,
    };

    setTextList((prev) => [...prev, item]);
    setText(value);
    setTextColor(color);
    setTextPosition(position);
    setTextSize(size);
    setTargetMesh(meshName);
    setSelectedId(id);
    setSelectedType("text");
    setTextInput("");
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!scene) {
      setError("Wait for the 3D model to load first.");
      return;
    }
    setError("");
    setUploading(true);

    try {
      const { url, name } = await uploadToCloudinary(file);
      const { meshName, position, quaternion, size } = pickMeshAndPlacement();
      const id = `logo-${Date.now()}`;

      const item = {
        id,
        name,
        url,
        position,
        quaternion,
        size,
        mesh: meshName,
      };

      setLogoList((prev) => [...prev, item]);
      setLogoUrl(url);
      setLogoPosition(position);
      setLogoSize(size);
      setTargetMesh(meshName);
      setSelectedId(id);
      setSelectedType("logo");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const clearSelection = () => {
    setSelectedId(null);
    setSelectedType(null);
    setText("");
    setTextColor("#111827");
    setTextPosition([0, 0, 0.02]);
    setTextSize(0.35);
    setLogoUrl("");
    setLogoPosition([0, 0, 0.02]);
    setLogoSize(0.4);
    setTargetMesh("");
    setEditTextInput("");
  };

  const handleSaveTextEdit = () => {
    const value = editTextInput.trim();
    if (!value || !selectedId || selectedType !== "text") return;
    setError("");

    setTextList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, text: value, name: value } : item
      )
    );
    setText(value);
  };

  const handleDeleteSelected = () => {
    if (!selectedId || !selectedType) return;

    if (selectedType === "text") {
      setTextList((prev) => prev.filter((item) => item.id !== selectedId));
    } else {
      setLogoList((prev) => prev.filter((item) => item.id !== selectedId));
    }
    clearSelection();
  };

  const handleDeleteText = (id, e) => {
    e.stopPropagation();
    setTextList((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id && selectedType === "text") clearSelection();
  };

  const handleDeleteLogo = (id, e) => {
    e.stopPropagation();
    setLogoList((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id && selectedType === "logo") clearSelection();
  };

  const handleTextColorChange = (color) => {
    if (!selectedId || selectedType !== "text") return;

    setTextColor(color);
    setTextList((prev) =>
      prev.map((item) =>
        item.id === selectedId ? { ...item, color } : item
      )
    );
  };

  const changeSize = (delta) => {
    if (!selectedId) return;

    if (selectedType === "text") {
      const newSize = Math.max(0.1, Math.min(1.5, +(textSize + delta).toFixed(2)));
      setTextSize(newSize);
      setTextList((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, size: newSize } : item
        )
      );
    } else if (selectedType === "logo") {
      const newSize = Math.max(0.1, Math.min(1.5, +(logoSize + delta).toFixed(2)));
      setLogoSize(newSize);
      setLogoList((prev) =>
        prev.map((item) =>
          item.id === selectedId ? { ...item, size: newSize } : item
        )
      );
    }
  };

  const activeTextSelected = selectedType === "text" && selectedId;
  const activeItemSelected = !!selectedId;
  const currentSize = selectedType === "text" ? textSize : logoSize;

  return (
    <div className="space-y-5 font-mono text-[10px]">
      <span className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">
        Text & Logo
      </span>

      {error && (
        <p className="text-[9px] text-red-600 bg-red-50 border border-red-200 p-2 rounded">
          {error}
        </p>
      )}

      {/* Add text */}
      <div className="space-y-1.5">
        <span className="text-zinc-400">ADD_TEXT</span>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddText()}
            placeholder="Enter text..."
            className="flex-1 px-2 py-1.5 border border-zinc-200 rounded-sm bg-white text-zinc-700 text-[10px] focus:outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            onClick={handleAddText}
            className="px-2.5 py-1.5 bg-zinc-800 text-white text-[9px] font-bold rounded-sm hover:bg-zinc-700 cursor-pointer"
          >
            ADD
          </button>
        </div>
      </div>

      {/* Upload logo */}
      <div className="space-y-1.5">
        <span className="text-zinc-400">UPLOAD_LOGO</span>
        <label
          className={`flex items-center justify-center gap-1.5 py-2 border border-dashed border-zinc-300 rounded-sm cursor-pointer hover:border-zinc-400 bg-white transition-colors ${
            uploading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <svg className="w-3.5 h-3.5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-[9px] font-bold text-zinc-600">
            {uploading ? "UPLOADING..." : "CHOOSE_IMAGE"}
          </span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {/* Text list */}
      {textList.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-zinc-400">TEXT_LIST</span>
          <ul className="space-y-1">
            {textList.map((item) => (
              <li key={item.id} className="flex gap-1">
                <button
                  type="button"
                  onClick={() => selectTextItem(item)}
                  className={`flex-1 text-left px-2 py-1.5 border rounded-sm text-[9px] font-bold truncate cursor-pointer transition-colors ${
                    selectedId === item.id && selectedType === "text"
                      ? "border-zinc-800 bg-zinc-100 text-zinc-800"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {item.name}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteText(item.id, e)}
                  title="Delete text"
                  className="px-2 py-1.5 border border-red-200 bg-red-50 text-red-600 rounded-sm text-[9px] font-bold hover:bg-red-100 cursor-pointer"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Logo list */}
      {logoList.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-zinc-400">IMAGE_LIST</span>
          <ul className="space-y-1">
            {logoList.map((item) => (
              <li key={item.id} className="flex gap-1">
                <button
                  type="button"
                  onClick={() => selectLogoItem(item)}
                  className={`flex-1 text-left px-2 py-1.5 border rounded-sm text-[9px] font-bold truncate cursor-pointer transition-colors ${
                    selectedId === item.id && selectedType === "logo"
                      ? "border-zinc-800 bg-zinc-100 text-zinc-800"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300"
                  }`}
                >
                  {item.name}
                </button>
                <button
                  type="button"
                  onClick={(e) => handleDeleteLogo(item.id, e)}
                  title="Delete image"
                  className="px-2 py-1.5 border border-red-200 bg-red-50 text-red-600 rounded-sm text-[9px] font-bold hover:bg-red-100 cursor-pointer"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Edit selected text */}
      {activeTextSelected && (
        <div className="space-y-1.5">
          <span className="text-zinc-400">EDIT_TEXT</span>
          <input
            type="text"
            value={editTextInput}
            onChange={(e) => setEditTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSaveTextEdit()}
            placeholder="Edit text..."
            className="w-full px-2 py-1.5 border border-zinc-200 rounded-sm bg-white text-zinc-700 text-[10px] focus:outline-none focus:border-zinc-400"
          />
          <button
            type="button"
            onClick={handleSaveTextEdit}
            className="w-full py-1.5 bg-zinc-800 text-white text-[9px] font-bold rounded-sm hover:bg-zinc-700 cursor-pointer"
          >
            SAVE_TEXT
          </button>
        </div>
      )}

      {/* Delete selected item */}
      {activeItemSelected && (
        <button
          type="button"
          onClick={handleDeleteSelected}
          className="w-full py-1.5 border border-red-200 bg-red-50 text-red-700 text-[9px] font-bold rounded-sm hover:bg-red-100 cursor-pointer"
        >
          DELETE_{selectedType === "text" ? "TEXT" : "IMAGE"}
        </button>
      )}

      {/* Size controls */}
      {activeItemSelected && (
        <div className="space-y-1.5">
          <span className="text-zinc-400">SIZE</span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeSize(-0.05)}
              className="flex-1 py-2 border border-zinc-200 bg-white rounded-sm text-[11px] font-bold hover:bg-zinc-100 cursor-pointer"
            >
              −
            </button>
            <span className="px-2 text-[9px] font-bold text-zinc-600 min-w-12 text-center">
              {currentSize.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={() => changeSize(0.05)}
              className="flex-1 py-2 border border-zinc-200 bg-white rounded-sm text-[11px] font-bold hover:bg-zinc-100 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* Text color (only when a text item is selected) */}
      {activeTextSelected && (
        <ColorPalette
          color={textColor || "#111827"}
          onColorChange={handleTextColorChange}
          label="Text Color"
        />
      )}

      {/* Drag hint */}
      {selectedId && (
        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-sm text-[9px] text-blue-700">
          Click and hold the text or logo on the model, then drag to move it. Use +/− to resize.
        </div>
      )}
    </div>
  );
};

export default LogoTextPanel;
