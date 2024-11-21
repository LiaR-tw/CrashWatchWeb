"use client";

import React, { useState } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import InstitutionsTable from "./Institutions/InstitutionsTable";
import ReportsView from "./Reports/ReportsView";
import Register from "./Register/page";
import AccidentsView from "./Accidents/page";
import MapView from "./Map/page";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<"map" |"accidents"|"institutions" | "reports" | "Register" | "ChangePassword">("map");

  return (
    <div className="flex min-h-screen bg-cover bg-fixed">
      <Sidebar onChangeView={setCurrentView} />

      <main className="flex-1 ml-64 bg-white p-6 rounded-tl-3xl rounded-bl-3xl shadow-lg">
        <Header />
        <div className="px-8 py-6 bg-white rounded-lg shadow-md">
          {currentView === "institutions" && <InstitutionsTable />}
          {currentView === "accidents" && <AccidentsView />}
          {currentView === "reports" && <ReportsView />}
          {currentView === "map" && <MapView />}
          {currentView === "Register" && <Register />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
