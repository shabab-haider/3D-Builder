import React, { useContext, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Stage } from "@react-three/drei";
import AmericanFootballJersey from "../../../Models/AMERICAN FOOTBALL/AmericanFootballJersey";
import FlagFootballJersey from "../../../Models/AMERICAN FOOTBALL/FlagFootballJersey";
import CrewNeckJerseys from "../../../Models/BASEBALL/CrewNeckJerseys";
import FullButtonJersey from "../../../Models/BASEBALL/FullButtonJersey";
import SingleBasketballVNeck from "../../../Models/BASKETBALL/SingleBasketballVNeck";
import SingleShorts from "../../../Models/BASKETBALL/SingleShorts";
import Jerseys from "../../../Models/ICE HOCKEY/Jerseys";
import LACROSSEJersey from "../../../Models/LACROSSE/LACROSSEJersey";
import Shorts from "../../../Models/LACROSSE/Shorts";
import TanktopPinies from "../../../Models/LACROSSE/TanktopPinies";
import WomenShorts from "../../../Models/LACROSSE/WomenShorts";
import WomenSkorts from "../../../Models/LACROSSE/WomenSkorts";
import WomenTanktops from "../../../Models/LACROSSE/WomenTanktops";
import SOCCERJerseys from "../../../Models/SOCCER/SOCCERJerseys";
import SOCCERShorts from "../../../Models/SOCCER/SOCCERShorts";
import SOFTBALLCrewNeckJerseys from "../../../Models/SOFTBALL/SOFTBALLCrewNeckJerseys";
import SOFTBALLShorts from "../../../Models/SOFTBALL/SOFTBALLShorts";
import Hodies from "../../../Models/SPORTS WEARS/Hodies";
import HodiesShirtsShotingShirts from "../../../Models/SPORTS WEARS/HodiesShirtsShotingShirts";
import PoloShirts from "../../../Models/SPORTS WEARS/PoloShirts";
import PullOverLongSleeves from "../../../Models/SPORTS WEARS/PullOverLongSleeves";
import SleevelessHodies from "../../../Models/SPORTS WEARS/SleevelessHodies";

import { dashboardDataContext } from "../../dashboard/state/dashboard.context";

const ProductCanvas = () => {
  const { model } = useContext(dashboardDataContext);
  const components = {
    americanfootballjersey: <AmericanFootballJersey />,
    flagfootballjersey: <FlagFootballJersey />,
    crewneckjerseys: <CrewNeckJerseys />,
    fullbuttonjersey: <FullButtonJersey />,
    singlebasketballvneck: <SingleBasketballVNeck />,
    singleshorts: <SingleShorts />,
    jerseys: <Jerseys />,
    lacrossejersey: <LACROSSEJersey />,
    shorts: <Shorts />,
    tanktoppinies: <TanktopPinies />,
    womenshorts: <WomenShorts />,
    womenskorts: <WomenSkorts />,
    womentanktops: <WomenTanktops />,
    soccerjerseys: <SOCCERJerseys />,
    soccershorts: <SOCCERShorts />,
    softballcrewneckjerseys: <SOFTBALLCrewNeckJerseys />,
    softballshorts: <SOFTBALLShorts />,
    hodies: <Hodies />,
    hodiesshirtsshotingshirts: <HodiesShirtsShotingShirts />,
    poloshirts: <PoloShirts />,
    pulloverlongsleeves: <PullOverLongSleeves />,
    sleevelesshodies: <SleevelessHodies />,
  };
  return (
    <div className="w-full h-screen bg-gray-100 overflow-hidden">
      <Canvas
        // Preserving the drawing buffer lets you easily take screenshots/save designs later
        gl={{ preserveDrawingBuffer: true }}
        camera={{ position: [0, 0, 2], fov: 45 }}
      >
        {/* Soft, ambient lighting for general visibility */}
        <ambientLight intensity={0.5} />

        {/* Main directional light acting like sunlight */}
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* Secondary soft light to fill shadows on the opposite side */}
        <directionalLight position={[-10, 5, -5]} intensity={0.3} />

        {/* Stage automatically centers, scales, and drops a shadow for the model */}
        <Stage
          environment="city"
          intensity={0.6}
          contactShadow={{ blur: 2, opacity: 0.5 }}
          adjustCamera={1.5}
        >
          <Center>{components[model]}</Center>
        </Stage>

        {/* Enables user interaction (rotate, pan, zoom) */}
        <OrbitControls
          enablePan={false} // Stops the user from dragging the shirt off-screen
          enableZoom={false}
          minDistance={1} // Restricts zooming too close
          maxDistance={4} // Restricts zooming too far out
          minPolarAngle={Math.PI / 2} // Locks vertical rotation at the horizon line
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ProductCanvas;
