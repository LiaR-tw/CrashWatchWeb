"use client";

import React, { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import StatsCard from "./Reports/StatsCard";
import InstitutionsTable from "./Institutions/InstitutionsTable";
import ReportsTable from "./Reports/page";
import MapView from "./Map/page";

const Dashboard: React.FC = () => {
  // Estado para manejar la vista actual
  const [currentView, setCurrentView] = useState<"institutions" | "reports" | "map">("institutions");

  // Función para cambiar la vista
  const handleViewChange = (view: "institutions" | "reports" | "map") => {
    setCurrentView(view);
  };

  return (
    <div className="flex bg-gray-50">
      {/* Sidebar con opciones */}
      <Sidebar onChangeView={handleViewChange} />

      <main className="flex-1">
        {/* Header */}
        <Header />

        {/* Contenido dinámico basado en la vista actual */}
        <div className="px-8 py-6">
          {currentView === "institutions" && (
            <InstitutionsTable />
          )}
          {currentView === "reports" && (
            <>
              <StatsCard />
              <ReportsTable />
            </>
          )}
          {currentView === "map" && (
            <>
              <StatsCard />
              <MapView />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
