import React from "react";
import { RouterProvider } from "react-router";
import { router } from "../app.route";
import DashboardContext from "./features/dashboard/state/dashboard.context";

const App = () => {
  return (
    <DashboardContext>
      <RouterProvider router={router} />;
    </DashboardContext>
  );
};

export default App;
