import React, { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

const ModelRenderer = ({
  url,
  partColors,
  selectedPart,
  onMeshClick,
  onPartsDetected,
  onSceneReady,
}) => {
  const { scene } = useGLTF(url);

  // Parse meshes and default colors when the model loads
  useEffect(() => {
    if (!scene) return;
    const parts = [];
    const initialColors = {};

    scene.traverse((child) => {
      if (child.isMesh) {
        // Skip decal/overlay meshes
        if (child.userData?.isOverlay) return;

        const partName = child.name || child.uuid;
        parts.push(partName);
        if (child.material && child.material.color) {
          initialColors[partName] = `#${child.material.color.getHexString()}`;
        } else {
          initialColors[partName] = "#ffffff";
        }
      }
    });

    if (onPartsDetected) {
      onPartsDetected(parts, initialColors);
    }
    if (onSceneReady) {
      onSceneReady(scene);
    }
  }, [scene, url]); // Re-run if model url changes

  // Apply colors dynamically
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child) => {
      if (child.isMesh) {
        // Skip decal/overlay meshes
        if (child.userData?.isOverlay) return;

        const partName = child.name || child.uuid;

        if (child.material) {
          // Clone material to ensure meshes don't share material changes
          if (!child.userData.materialCloned) {
            child.material = child.material.clone();
            child.userData.materialCloned = true;
          }

          // Apply color override if exists
          if (partColors[partName]) {
            child.material.color.set(partColors[partName]);
          }
        }
      }
    });
  }, [scene, partColors, selectedPart]);

  return (
    <primitive
      object={scene}
      onClick={(e) => {
        e.stopPropagation();
        if (onMeshClick) {
          // Skip overlay clicks
          if (e.object.userData?.isOverlay) return;
          onMeshClick(e.object.name || e.object.uuid, e);
        }
      }}
    />
  );
};

export default ModelRenderer;
