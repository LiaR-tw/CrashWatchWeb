"use client";

import React, { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import InstitutionsTable from "./Institutions/InstitutionsTable";
import ReportsView from "./Reports/ReportsView"; // Usa ReportsView aquí
import MapView from "./Map/page";
import Register from "./Register/page";
import ChangePassword from "./ChangePassword/page";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<"institutions" | "reports" | "map" | "Register" | "ChangePassword">("institutions");

  return (
    <div className="flex bg-gradient-to-br from-[#1e3a8a] to-[#000000] min-h-screen">
      {/* Sidebar */}
      <Sidebar onChangeView={setCurrentView} />

      <main className="flex-1 ml-64 bg-[#1e3a8a]"> {/* ml-64 para dejar espacio para el Sidebar */}
        <Header />
        <div className="px-8 py-6">
          {/* Solo renderiza la vista seleccionada */}
          {currentView === "institutions" && <InstitutionsTable />}
          {currentView === "reports" && <ReportsView />}
          {currentView === "map" && <MapView />}
          {currentView === "Register" && <Register />}
          {currentView === "ChangePassword" && <ChangePassword />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
