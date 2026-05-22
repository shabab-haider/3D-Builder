import React, { useMemo, useEffect, useRef, useState, useCallback } from "react";
import { createPortal, useThree } from "@react-three/fiber";
import { useTexture, Decal } from "@react-three/drei";
import * as THREE from "three";
import { createTextTexture } from "../utils/createTextTexture";
import { findMeshByName, placementFromHit } from "../utils/meshHelpers";

function TextDragPreview({ item, previewRef }) {
  const texture = useMemo(() => createTextTexture(item.text, item.color), [item.text, item.color]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  const aspect = 4;
  const scale = useMemo(() => [item.size * aspect, item.size, 1], [item.size, aspect]);
  const initialQuat = useMemo(() => {
    const baseQuat = new THREE.Quaternion(...item.initialLocalQuat);
    const spinQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(item.rotationAngle || 0)
    );
    return baseQuat.multiply(spinQuat);
  }, [item.initialLocalQuat, item.rotationAngle]);

  return (
    <mesh ref={previewRef} position={item.initialLocalPos} quaternion={initialQuat} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest={true}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-20}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function LogoDragPreview({ item, previewRef }) {
  const texture = useTexture(item.url);

  const aspect = texture.image
    ? texture.image.width / texture.image.height
    : 1;

  const scale = useMemo(() => [item.size * aspect, item.size, 1], [item.size, aspect]);
  const initialQuat = useMemo(() => {
    const baseQuat = new THREE.Quaternion(...item.initialLocalQuat);
    const spinQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(item.rotationAngle || 0)
    );
    return baseQuat.multiply(spinQuat);
  }, [item.initialLocalQuat, item.rotationAngle]);

  return (
    <mesh ref={previewRef} position={item.initialLocalPos} quaternion={initialQuat} scale={scale}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        depthTest={true}
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-20}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function TextOverlay({
  item,
  scene,
  isSelected,
  onSelect,
  startDrag,
  isDraggingThis,
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

  const aspect = 4;
  const rotation = useMemo(() => {
    if (!item.quaternion) return [0, 0, 0];
    const baseQuat = new THREE.Quaternion(...item.quaternion);
    const spinQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(item.rotationAngle || 0)
    );
    const finalQuat = baseQuat.multiply(spinQuat);
    const e = new THREE.Euler().setFromQuaternion(finalQuat, "XYZ");
    return [e.x, e.y, e.z];
  }, [item.quaternion, item.rotationAngle]);

  const scale = useMemo(() => {
    if (!parentMesh) return [item.size * aspect, item.size, 0.4];

    // Get the absolute world scale of the parent mesh to normalize decal size
    const tempScale = new THREE.Vector3();
    parentMesh.getWorldScale(tempScale);

    const sx = tempScale.x || 1;
    const sy = tempScale.y || 1;
    const sz = tempScale.z || 1;

    // Divide target world size by parent's world scale to keep visual size constant
    return [
      (item.size * aspect) / sx,
      item.size / sy,
      0.4 / sz,
    ];
  }, [item.size, aspect, parentMesh]);

  if (isDraggingThis) return null;
  if (!parentMesh) return null;

  return createPortal(
    <Decal
      mesh={parentMesh}
      userData={{ isOverlay: true }}
      position={item.position}
      rotation={rotation}
      scale={scale}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.id, "text");
        startDrag(item, "text", e.clientX, e.clientY);
      }}
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
  startDrag,
  isDraggingThis,
}) {
  const parentMesh = useMemo(
    () => findMeshByName(scene, item.mesh),
    [scene, item.mesh]
  );

  const texture = useTexture(item.url);

  const aspect = texture.image
    ? texture.image.width / texture.image.height
    : 1;

  const rotation = useMemo(() => {
    if (!item.quaternion) return [0, 0, 0];
    const baseQuat = new THREE.Quaternion(...item.quaternion);
    const spinQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 0, 1),
      THREE.MathUtils.degToRad(item.rotationAngle || 0)
    );
    const finalQuat = baseQuat.multiply(spinQuat);
    const e = new THREE.Euler().setFromQuaternion(finalQuat, "XYZ");
    return [e.x, e.y, e.z];
  }, [item.quaternion, item.rotationAngle]);

  const scale = useMemo(() => {
    if (!parentMesh) return [item.size * aspect, item.size, 0.4];

    // Get the absolute world scale of the parent mesh to normalize decal size
    const tempScale = new THREE.Vector3();
    parentMesh.getWorldScale(tempScale);

    const sx = tempScale.x || 1;
    const sy = tempScale.y || 1;
    const sz = tempScale.z || 1;

    // Divide target world size by parent's world scale to keep visual size constant
    return [
      (item.size * aspect) / sx,
      item.size / sy,
      0.4 / sz,
    ];
  }, [item.size, aspect, parentMesh]);

  if (isDraggingThis) return null;
  if (!parentMesh) return null;

  return createPortal(
    <Decal
      mesh={parentMesh}
      userData={{ isOverlay: true }}
      position={item.position}
      rotation={rotation}
      scale={scale}
      onPointerDown={(e) => {
        e.stopPropagation();
        onSelect(item.id, "logo");
        startDrag(item, "logo", e.clientX, e.clientY);
      }}
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
  const { camera, gl } = useThree();
  const [draggingItem, setDraggingItem] = useState(null);
  const previewRef = useRef();
  const groupRef = useRef();
  const lastHitRef = useRef(null);

  // Keep latest callbacks in refs to avoid stale closures in window event listeners
  const callbacksRef = useRef({ onPlacementUpdate, onDragStart, onDragEnd });
  useEffect(() => {
    callbacksRef.current = { onPlacementUpdate, onDragStart, onDragEnd };
  }, [onPlacementUpdate, onDragStart, onDragEnd]);

  const startDrag = useCallback(
    (item, type, clientX, clientY) => {
      if (!scene || !groupRef.current) return;

      const rect = gl.domElement.getBoundingClientRect();
      const pointer = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(pointer, camera);

      const hits = raycaster.intersectObjects(scene.children, true);
      const surfaceHit = hits.find(
        (h) =>
          h.object.isMesh &&
          !h.object.userData?.isOverlay
      );

      if (!surfaceHit) return;

      const worldNormal = surfaceHit.face.normal
        .clone()
        .transformDirection(surfaceHit.object.matrixWorld)
        .normalize();

      // Use a larger offset (0.015) during drag to avoid z-fighting/clipping
      const worldPos = surfaceHit.point.clone().addScaledVector(worldNormal, 0.015);
      const quat = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        worldNormal
      );

      // Convert world position and normal/quaternion to group's local space
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.copy(groupRef.current.matrixWorld).invert();
      const localPos = worldPos.clone().applyMatrix4(tempMatrix);

      const parentWorldQuat = new THREE.Quaternion();
      groupRef.current.getWorldQuaternion(parentWorldQuat);
      const localQuat = parentWorldQuat.invert().multiply(quat);

      // Save initial hit
      lastHitRef.current = surfaceHit;

      setDraggingItem({
        ...item,
        type,
        initialLocalPos: [localPos.x, localPos.y, localPos.z],
        initialLocalQuat: [localQuat.x, localQuat.y, localQuat.z, localQuat.w]
      });

      callbacksRef.current.onDragStart?.();

      const handlePointerMove = (moveEvent) => {
        if (!previewRef.current || !groupRef.current) return;

        const rect = gl.domElement.getBoundingClientRect();
        const pointer = new THREE.Vector2(
          ((moveEvent.clientX - rect.left) / rect.width) * 2 - 1,
          -((moveEvent.clientY - rect.top) / rect.height) * 2 + 1
        );

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(pointer, camera);

        // Raycast against the scene meshes
        const hits = raycaster.intersectObjects(scene.children, true);
        
        // Find the first mesh hit that is not the preview mesh and not an overlay
        const surfaceHit = hits.find(
          (h) =>
            h.object.isMesh &&
            h.object !== previewRef.current &&
            !h.object.userData?.isOverlay
        );

        if (surfaceHit) {
          lastHitRef.current = surfaceHit;

          // Compute world normal and world position
          const worldNormal = surfaceHit.face.normal
            .clone()
            .transformDirection(surfaceHit.object.matrixWorld)
            .normalize();

          // Use a larger offset (0.015) during drag to avoid z-fighting/clipping
          const worldPos = surfaceHit.point.clone().addScaledVector(worldNormal, 0.015);

          // Convert to local space of the group
          const tempMatrix = new THREE.Matrix4();
          tempMatrix.copy(groupRef.current.matrixWorld).invert();
          const localPos = worldPos.clone().applyMatrix4(tempMatrix);

          previewRef.current.position.copy(localPos);

          const quat = new THREE.Quaternion().setFromUnitVectors(
            new THREE.Vector3(0, 0, 1),
            worldNormal
          );
          
          const parentWorldQuat = new THREE.Quaternion();
          groupRef.current.getWorldQuaternion(parentWorldQuat);
          const localQuat = parentWorldQuat.invert().multiply(quat);

          // Apply manual rotation spin during move
          const spinQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 0, 1),
            THREE.MathUtils.degToRad(item.rotationAngle || 0)
          );
          const finalLocalQuat = localQuat.multiply(spinQuat);

          previewRef.current.quaternion.copy(finalLocalQuat);
          previewRef.current.visible = true;
        } else {
          // If no hit, we can keep the preview hidden
          previewRef.current.visible = false;
        }
      };

      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);

        // Save placement if we have a valid hit
        if (lastHitRef.current) {
          const hitMesh = lastHitRef.current.object;
          const placement = placementFromHit(hitMesh, lastHitRef.current);
          
          // Carry over the current rotationAngle when updating placement
          callbacksRef.current.onPlacementUpdate(
            item.id,
            type,
            {
              ...placement,
              meshName: hitMesh.name || hitMesh.uuid,
              rotationAngle: item.rotationAngle || 0,
            }
          );
        }

        lastHitRef.current = null;
        setDraggingItem(null);
        callbacksRef.current.onDragEnd?.();
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    },
    [scene, camera, gl]
  );

  if (!scene) return null;

  return (
    <group ref={groupRef}>
      {textList.map((item) => (
        <TextOverlay
          key={item.id}
          item={item}
          scene={scene}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          startDrag={startDrag}
          isDraggingThis={draggingItem && draggingItem.id === item.id}
        />
      ))}
      {logoList.map((item) => (
        <LogoOverlay
          key={item.id}
          item={item}
          scene={scene}
          isSelected={selectedId === item.id}
          onSelect={onSelect}
          startDrag={startDrag}
          isDraggingThis={draggingItem && draggingItem.id === item.id}
        />
      ))}
      {draggingItem && draggingItem.type === "text" && (
        <TextDragPreview item={draggingItem} previewRef={previewRef} />
      )}
      {draggingItem && draggingItem.type === "logo" && (
        <LogoDragPreview item={draggingItem} previewRef={previewRef} />
      )}
    </group>
  );
};

export default MeshOverlays;

