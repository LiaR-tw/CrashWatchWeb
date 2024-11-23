"use client";

import React, { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import InstitutionsTable from "./Institutions/InstitutionsTable";
import ReportsView from "./Reports/ReportsView";
import Register from "./Institutions/RegisterInstitution";
import AccidentsView from "./Accidents/page";
import MapView from "./Map/page";
import UsersTable from "./Users/page";
import Profile from "./Profile/page";

const accessToken = 'DQEDACk4MlhnmOmdmSVkBNDeJZ6qPhCndg2EUV5ihtAlqHuAbdy5dIY7wfMhlkZZXQc9Z8nFXfWaT3zoZ2pTOsC8soZE8pYPcSOnBQ==';

type ViewType =
  | "map"
  | "accidents"
  | "institutions"
  | "reports"
  | "Register"
  | "ChangePassword"
  | "Users"
  | "Profile";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("map");

  // Diccionario para componentes
  const viewComponents: Record<ViewType, React.ReactNode> = {
    map: <MapView accessToken={accessToken} />,
    accidents: <AccidentsView />,
    institutions: <InstitutionsTable />,
    reports: <ReportsView />,
    Register: <Register />,
    ChangePassword: <div>Change Password Component Placeholder</div>, // Agrega el componente cuando esté listo
    Users: <UsersTable />,
    Profile: <Profile />,
  };

  return (
    <div className="flex min-h-screen bg-cover bg-fixed">
      {/* Sidebar */}
      <Sidebar onChangeView={setCurrentView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-white p-6 rounded-tl-3xl rounded-bl-3xl shadow-lg">
        <Header />
        <div className="px-8 py-6 bg-white rounded-lg shadow-md">
          {/* Render dinámico basado en la vista actual */}
          {viewComponents[currentView] || <div>Vista no encontrada</div>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
