import React, { useContext, useState, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Environment, ContactShadows } from "@react-three/drei";
import { dashboardDataContext } from "../../dashboard/state/dashboard.context";
import { builderContext } from "../state/builder.context";
import ModelRenderer from "../components/ModelRenderer";
import MeshOverlays from "../components/MeshOverlays";
import { placementFromHit } from "../utils/meshHelpers";

const ProductCanvas = ({
  selectedPart,
  setSelectedPart,
  onPartsDetected,
}) => {
  const { model, partColors } = useContext(dashboardDataContext);
  const {
    textList,
    logoList,
    selectedId,
    setSelectedId,
    selectedType,
    setSelectedType,
    setTextPosition,
    setTextQuaternion,
    setLogoPosition,
    setLogoQuaternion,
    setTextList,
    setLogoList,
    setText,
    setTextColor,
    setTextSize,
    setLogoUrl,
    setLogoSize,
    setTargetMesh,
    setModelScene,
  } = useContext(builderContext);

  const [scene, setScene] = useState(null);
  const [orbitEnabled, setOrbitEnabled] = useState(true);

  const handleSceneReady = (loadedScene) => {
    setScene(loadedScene);
    setModelScene(loadedScene);
  };

  const handleOverlaySelect = useCallback(
    (id, type) => {
      setSelectedId(id);
      setSelectedType(type);

      if (type === "text") {
        const item = textList.find((t) => t.id === id);
        if (item) {
          setText(item.text);
          setTextColor(item.color);
          setTextPosition(item.position);
          setTextQuaternion(item.quaternion || [0, 0, 0, 1]);
          setTextSize(item.size);
          setTargetMesh(item.mesh);
        }
      } else {
        const item = logoList.find((l) => l.id === id);
        if (item) {
          setLogoUrl(item.url);
          setLogoPosition(item.position);
          setLogoQuaternion(item.quaternion || [0, 0, 0, 1]);
          setLogoSize(item.size);
          setTargetMesh(item.mesh);
        }
      }
    },
    [
      textList,
      logoList,
      setSelectedId,
      setSelectedType,
      setText,
      setTextColor,
      setTextPosition,
      setTextSize,
      setLogoUrl,
      setLogoPosition,
      setLogoSize,
      setTargetMesh,
    ]
  );

  const handlePlacementUpdate = useCallback(
    (id, type, { position, quaternion, meshName }) => {
      if (type === "text") {
        if (selectedId === id) {
          setTextPosition(position);
          setTextQuaternion(quaternion);
          if (meshName) setTargetMesh(meshName);
        }
        setTextList((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, position, quaternion, mesh: meshName || item.mesh }
              : item
          )
        );
      } else if (type === "logo") {
        if (selectedId === id) {
          setLogoPosition(position);
          setLogoQuaternion(quaternion);
          if (meshName) setTargetMesh(meshName);
        }
        setLogoList((prev) =>
          prev.map((item) =>
            item.id === id
              ? { ...item, position, quaternion, mesh: meshName || item.mesh }
              : item
          )
        );
      }
    },
    [
      selectedId,
      setTextPosition,
      setTextQuaternion,
      setLogoPosition,
      setLogoQuaternion,
      setTargetMesh,
      setTextList,
      setLogoList,
    ]
  );

  return (
    <div className="w-full h-full bg-zinc-100 overflow-hidden relative">
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 2.2], fov: 45 }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-5, 4, -5]} intensity={0.5} />
        <Center key={model}>
          <ModelRenderer
            url={model}
            partColors={partColors}
            selectedPart={selectedPart}
            onMeshClick={(meshName, e) => {
              if (selectedId) {
                const placement = placementFromHit(e.object, e);
                handlePlacementUpdate(selectedId, selectedType, {
                  ...placement,
                  meshName: e.object.name || e.object.uuid,
                });
              } else {
                setSelectedPart(meshName);
              }
            }}
            onPartsDetected={onPartsDetected}
            onSceneReady={handleSceneReady}
          />
          <Suspense fallback={null}>
            <MeshOverlays
              scene={scene}
              textList={textList}
              logoList={logoList}
              selectedId={selectedId}
              onSelect={handleOverlaySelect}
              onPlacementUpdate={handlePlacementUpdate}
              onDragStart={() => setOrbitEnabled(false)}
              onDragEnd={() => setOrbitEnabled(true)}
            />
          </Suspense>
        </Center>

        <Environment preset="city" />
        <ContactShadows
          position={[0, -0.7, 0]}
          opacity={0.4}
          scale={5}
          blur={1.5}
          far={0.8}
        />

        <OrbitControls
          enabled={orbitEnabled}
          enablePan={false}
          enableZoom={true}
          minDistance={1.0}
          maxDistance={5.0}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default ProductCanvas;
