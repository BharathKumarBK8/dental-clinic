import React, { useEffect, useState } from "react";
import "./App.css";
import Header from "../Layout/Header/Header";
import LeftMenu from "../Layout/LeftMenu/LeftMenu";
import { getRouteConfig } from "../API/config";
import AppRoutes, { RouteConfigModel } from "./AppRoutes";

function App() {
  const [routes, setRoutes] = useState<Array<RouteConfigModel> | null>(null);

  useEffect(() => {
    getRouteConfig().then((response: Array<RouteConfigModel>) => {
      setRoutes(response);
    });
  }, []);

  return (
    <div>
      <Header></Header>
      <div className="body_section">
        <LeftMenu></LeftMenu>
        <div className="content_section">
          <AppRoutes routes={routes} />
        </div>
      </div>
    </div>
  );
}

export default App;
