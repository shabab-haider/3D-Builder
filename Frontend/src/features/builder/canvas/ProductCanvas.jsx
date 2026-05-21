import React, { useContext, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Environment, ContactShadows } from "@react-three/drei";
import { dashboardDataContext } from "../../dashboard/state/dashboard.context";
import ModelRenderer from "../components/ModelRenderer";

const ProductCanvas = ({
  selectedPart,
  setSelectedPart,
  onPartsDetected,
}) => {
  const { model, partColors } = useContext(dashboardDataContext);

  if (!model) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-400 font-medium">No 3D Model Selected</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-100 overflow-hidden relative">
      <Canvas
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 2.2], fov: 45 }}
      >
        {/* Professional Studio Lighting setup */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} />
        <directionalLight position={[-5, 4, -5]} intensity={0.5} />
        <Suspense fallback={null}>
          <Center key={model}>
            <ModelRenderer
              url={model}
              partColors={partColors}
              selectedPart={selectedPart}
              onMeshClick={setSelectedPart}
              onPartsDetected={onPartsDetected}
            />
          </Center>
        </Suspense>

        {/* High-quality studio environment mapping & static contact shadows */}
        <Environment preset="city" />
        <ContactShadows
          position={[0, -0.7, 0]}
          opacity={0.4}
          scale={5}
          blur={1.5}
          far={0.8}
        />

        <OrbitControls
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
