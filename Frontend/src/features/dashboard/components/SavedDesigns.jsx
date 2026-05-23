import React, { useEffect, useState, useRef, Suspense } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { Canvas } from "@react-three/fiber";
import { Center, Environment } from "@react-three/drei";
import ModelRenderer from "../../builder/components/ModelRenderer";
import MeshOverlays from "../../builder/components/MeshOverlays";

const SavedDesignPreview = ({ design }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [scene, setScene] = useState(null);
  const containerRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative overflow-hidden pointer-events-none flex items-center justify-center min-h-40">
      {isVisible ? (
        <Canvas camera={{ position: [0, 0, 2.2], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 8, 5]} intensity={1.5} />
          <directionalLight position={[-5, 4, -5]} intensity={0.5} />
          <Center>
            <ModelRenderer
              url={design.modelPath}
              partColors={design.partColors || {}}
              onSceneReady={setScene}
              onPartsDetected={() => {}}
            />
            {scene && (
              <Suspense fallback={null}>
                <MeshOverlays
                  scene={scene}
                  textList={design.textList || []}
                  logoList={design.logoList || []}
                  selectedId={null}
                  onSelect={() => {}}
                  onPlacementUpdate={() => {}}
                  onDragStart={() => {}}
                  onDragEnd={() => {}}
                />
              </Suspense>
            )}
          </Center>
          <Environment preset="city" />
        </Canvas>
      ) : (
        <div className="text-[9px] text-zinc-400 font-mono uppercase tracking-wider animate-pulse">[LOAD_3D_VIEW...]</div>
      )}
    </div>
  );
};

const SavedDesigns = () => {
  const { designs, loading, fetchDesigns, deleteDesign, loadDesign } = useDashboard();

  useEffect(() => {
    fetchDesigns();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModelName = (path) => {
    if (!path) return "Unknown Model";
    return path.split("/").pop().replace(".glb", "");
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center font-mono">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin mb-3"></div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider">[SYS] CONNECTING_TO_DATABASE...</p>
      </div>
    );
  }

  if (!designs || designs.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-300 bg-zinc-50/50 p-8 rounded text-center max-w-lg mx-auto my-auto font-mono">
        <svg className="w-8 h-8 text-zinc-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
        <p className="text-zinc-500 font-bold text-xs uppercase mb-1">
          [SYS] NO_SAVED_DESIGNS_FOUND
        </p>
        <p className="text-zinc-400 text-[10px] leading-relaxed">
          You haven't saved any design configurations yet. Create a design in the 3D Builder workspace and click "Save Design" to see them listed here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full font-mono">
      {designs.map((design) => {
        const modelName = getModelName(design.modelPath);
        const colorCount = design.partColors ? Object.keys(design.partColors).length : 0;
        const textCount = design.textList ? design.textList.length : 0;
        const logoCount = design.logoList ? design.logoList.length : 0;

        return (
          <div
            key={design._id}
            className="bg-zinc-50 border border-zinc-200 rounded-sm overflow-hidden flex flex-col hover:border-zinc-400 hover:shadow-sm transition-all select-none group"
          >
            {/* Visual Asset Thumbnail */}
            <div className="h-40 bg-white flex items-center justify-center border-b border-zinc-200 relative">
              <span className="absolute top-2 left-2 text-[9px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 px-1.5 rounded z-10">
                3D_PREVIEW
              </span>
              <SavedDesignPreview design={design} />
            </div>

            {/* Design Technical Info */}
            <div className="p-3 bg-white border-b border-zinc-200 flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-mono text-zinc-400 bg-zinc-100 border border-zinc-200 px-1.5 py-0.5 rounded uppercase">
                  {design.productCategory || "PRODUCT"}
                </span>
                <span className="text-[9px] text-zinc-400 uppercase">
                  ID: {design._id.slice(-6)}
                </span>
              </div>

              <h3 className="text-xs font-black text-zinc-800 uppercase tracking-tight truncate mt-1" title={modelName}>
                {modelName}
              </h3>

              <div className="text-[9px] text-zinc-400 mt-1 flex justify-between">
                <span>SAVED:</span>
                <span className="font-bold text-zinc-500">{formatDate(design.createdAt)}</span>
              </div>
            </div>

            {/* Design Metadata Details */}
            <div className="p-3 flex-1 flex flex-col justify-between gap-3 bg-zinc-50/50">
              <div className="space-y-1 text-[10px] text-zinc-500">
                <div className="flex justify-between">
                  <span>Part Colors:</span>
                  <span className="font-bold text-zinc-700">{colorCount} parts</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Overlays:</span>
                  <span className="font-bold text-zinc-700">{textCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logo Overlays:</span>
                  <span className="font-bold text-zinc-700">{logoCount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => loadDesign(design)}
                  className="flex-1 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[9px] font-bold text-white text-center uppercase cursor-pointer rounded-xs transition-colors"
                >
                  Load Design
                </button>
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this saved design?")) {
                      deleteDesign(design._id);
                    }
                  }}
                  className="px-2.5 py-1.5 border border-red-200 hover:border-red-300 text-red-500 hover:bg-red-50/50 text-center cursor-pointer rounded-xs transition-colors"
                  title="Delete Design"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SavedDesigns;
