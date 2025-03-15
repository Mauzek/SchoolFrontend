import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../Header/Header";

export const Layout: React.FC = () => {
  const location = useLocation();
    return (
    <>
        {location.pathname !== "/" ? <Header /> : null}
      <Outlet />
    </>
  );
};
