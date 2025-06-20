import React from "react";

import { Outlet } from "react-router-dom";
import SideBar from "../components/hostRes/SideBar";

export default function RestaurentLayout() {
  return (
    <div className="flex">
      <SideBar />

      <div className="ml-[15vw] w-full flex">
        <hr
          className="h-auto w-0.5 bg-gray-200 border-0 fixed"
          style={{ height: "100vh" }}
        />
        <Outlet />
      </div>
    </div>
  );
}
