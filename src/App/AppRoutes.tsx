import React from "react";
import { Route, Routes } from "react-router-dom";
import PageCreator from "../Common/PageCreator/PageCreator";
import PrivateRoute from "../Services/PrivateRoute";

export interface RouteConfigModel {
  path: string;
  configPath: string;
  isPrivate: boolean;
}

const NotFound = () => <h2>404 Not Found</h2>;

const getComponent = (route: RouteConfigModel) => {
  return route.isPrivate ? (
    <PrivateRoute>
      <PageCreator {...route} />
    </PrivateRoute>
  ) : (
    <PageCreator {...route} />
  );
};

const AppRoutes: React.FC<{ routes: Array<RouteConfigModel> | null }> = ({
  routes,
}) => {
  return (
    <Routes>
      {routes?.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={getComponent(route)}
        />
      ))}
      <Route
        path="*"
        element={
          <PrivateRoute>
            <NotFound />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
