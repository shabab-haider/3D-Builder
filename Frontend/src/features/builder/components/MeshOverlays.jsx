import React, { useMemo, useEffect, useRef, useCallback } from "react";
import { createPortal, useThree } from "@react-three/fiber";
import { useTexture, Decal } from "@react-three/drei";
import * as THREE from "three";
import { createTextTexture } from "../utils/createTextTexture";
import { findMeshByName, getPlacementFromScreen } from "../utils/meshHelpers";

function useDragOnMesh({ onPlacementUpdate, onDragStart, onDragEnd }) {
  const { camera, gl, scene } = useThree();
  const dragging = useRef(false);

  const updatePlacement = useCallback(
    (clientX, clientY) => {
      if (!scene) return;

      const placement = getPlacementFromScreen(
        scene,
        camera,
        clientX,
        clientY,
        gl.domElement
      );

      if (placement) {
        onPlacementUpdate(placement);
      }
    },
    [scene, camera, gl, onPlacementUpdate]
  );

  const handlePointerDown = useCallback(
    (e) => {
      e.stopPropagation();
      dragging.current = true;
      onDragStart?.();
      if (e.target.setPointerCapture) {
        e.target.setPointerCapture(e.pointerId);
      }
      updatePlacement(e.clientX, e.clientY);
    },
    [onDragStart, updatePlacement]
  );

  const handlePointerMove = useCallback(
    (e) => {
      if (!dragging.current || e.buttons !== 1) return;
      e.stopPropagation();
      updatePlacement(e.clientX, e.clientY);
    },
    [updatePlacement]
  );

  const handlePointerUp = useCallback(
    (e) => {
      dragging.current = false;
      if (e.target.hasPointerCapture?.(e.pointerId)) {
        e.target.releasePointerCapture(e.pointerId);
      }
      onDragEnd?.();
    },
    [onDragEnd]
  );

  return { handlePointerDown, handlePointerMove, handlePointerUp };
}

function TextOverlay({
  item,
  scene,
  isSelected,
  onSelect,
  onPlacementUpdate,
  onDragStart,
  onDragEnd,
}) {
  const parentMesh = useMemo(
    () => findMeshByName(scene, item.mesh),
    [scene, item.mesh]
  );

  const [texture, setTexture] = React.useState(() =>
    createTextTexture(item.text, item.color)
  );

  useEffect(() => {
    const next = createTextTexture(item.text, item.color);
    setTexture((prev) => {
      prev.dispose();
      return next;
    });
    return () => next.dispose();
  }, [item.text, item.color]);

  const drag = useDragOnMesh({
    onPlacementUpdate,
    onDragStart,
    onDragEnd,
  });

  const aspect = 4;
  const rotation = useMemo(() => {
    if (!item.quaternion) return [0, 0, 0];
    const q = new THREE.Quaternion(...item.quaternion);
    const e = new THREE.Euler().setFromQuaternion(q, "XYZ");
    return [e.x, e.y, e.z];
  }, [item.quaternion]);

  const scale = useMemo(() => {
    // Drei Decal needs depth (Z scale) to project nicely on curved surfaces
    return [item.size * aspect, item.size, 0.4];
  }, [item.size, aspect]);

  if (!parentMesh) return null;

  return createPortal(
    <Decal
      mesh={parentMesh}
      userData={{ isOverlay: true }}
      position={item.position}
      rotation={rotation}
      scale={scale}
      onPointerDown={(e) => {
        onSelect(item.id, "text");
        drag.handlePointerDown(e);
      }}
      onPointerMove={drag.handlePointerMove}
      onPointerUp={drag.handlePointerUp}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest={true}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-10}
        side={THREE.DoubleSide}
        opacity={isSelected ? 1 : 0.95}
        color={isSelected ? "#aaddff" : "#ffffff"}
      />
    </Decal>,
    parentMesh
  );
}

function LogoOverlay({
  item,
  scene,
  isSelected,
  onSelect,
  onPlacementUpdate,
  onDragStart,
  onDragEnd,
}) {
  const parentMesh = useMemo(
    () => findMeshByName(scene, item.mesh),
    [scene, item.mesh]
  );

  const texture = useTexture(item.url);

  const drag = useDragOnMesh({
    onPlacementUpdate,
    onDragStart,
    onDragEnd,
  });

  const aspect = texture.image
    ? texture.image.width / texture.image.height
    : 1;

  const rotation = useMemo(() => {
    if (!item.quaternion) return [0, 0, 0];
    const q = new THREE.Quaternion(...item.quaternion);
    const e = new THREE.Euler().setFromQuaternion(q, "XYZ");
    return [e.x, e.y, e.z];
  }, [item.quaternion]);

  const scale = useMemo(() => {
    return [item.size * aspect, item.size, 0.4];
  }, [item.size, aspect]);

  if (!parentMesh) return null;

  return createPortal(
    <Decal
      mesh={parentMesh}
      userData={{ isOverlay: true }}
      position={item.position}
      rotation={rotation}
      scale={scale}
      onPointerDown={(e) => {
        onSelect(item.id, "logo");
        drag.handlePointerDown(e);
      }}
      onPointerMove={drag.handlePointerMove}
      onPointerUp={drag.handlePointerUp}
    >
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest={true}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-10}
        side={THREE.DoubleSide}
        opacity={isSelected ? 1 : 0.95}
        color={isSelected ? "#aaddff" : "#ffffff"}
      />
    </Decal>,
    parentMesh
  );
}

const MeshOverlays = ({
  scene,
  textList,
  logoList,
  selectedId,
  onSelect,
  onPlacementUpdate,
  onDragStart,
  onDragEnd,
}) => {
  if (!scene) return null;

  return (
    <>
      {textList.map((item) => (
        <TextOverlay
          key={item.id}
          item={item}
          scene={scene}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          onPlacementUpdate={(placement) =>
            onPlacementUpdate(item.id, "text", placement)
          }
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
      {logoList.map((item) => (
        <LogoOverlay
          key={item.id}
          item={item}
          scene={scene}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          onPlacementUpdate={(placement) =>
            onPlacementUpdate(item.id, "logo", placement)
          }
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        />
      ))}
    </>
  );
};

export default MeshOverlays;
