"use client";

import React, { useState } from "react";
import ReportsTable from "./page";
import ReportsNewAccidents from "./ReportsNewAccidents";
import StatsCards from "./StatsCard"; 

const Pages = {
  AccidentsAttended: ReportsTable,
  NewAccidents: ReportsNewAccidents,
  PeopleConnected: ReportsTable,
};

const ReportsView: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<keyof typeof Pages>("AccidentsAttended");

  const CurrentPageComponent = Pages[currentPage];

  return (
    <div>
      <StatsCards onStatClick={(page) => setCurrentPage(page as keyof typeof Pages)} />
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <CurrentPageComponent />
      </div>
    </div>
  );
};

export default ReportsView;
