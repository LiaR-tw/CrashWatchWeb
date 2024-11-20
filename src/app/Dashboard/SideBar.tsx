"use client";

import React from "react";

interface SidebarProps {
  onChangeView: (view: "institutions" | "reports" | "map") => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChangeView }) => {
  return (
    <div className="w-64 bg-white shadow-lg h-screen flex flex-col">
      <div className="p-4 font-bold text-lg">Dashboard</div>
      <ul className="flex-1">
        <li
          className="p-4 cursor-pointer hover:bg-gray-200"
          onClick={() => onChangeView("map")}
        >
          Map
        </li>
        <li
          className="p-4 cursor-pointer hover:bg-gray-200"
          onClick={() => onChangeView("institutions")}
        >
          Institutions
        </li>
        <li
          className="p-4 cursor-pointer hover:bg-gray-200"
          onClick={() => onChangeView("reports")}
        >
          Reports
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
