"use client";

import React, { useState } from "react";
import ReportsTable from "./page"; // Importa la tabla de reportes
import ReportsNewAccidents from "./ReportsNewAccidents"; 

// Datos del navbar dinámico
const stats = [
  { title: "Accidents Attended", value: "5,423", color: "bg-green-100 text-green-700" },
  { title: "New Accidents", value: "8", color: "bg-red-100 text-red-700" },
  { title: "People Connected", value: "189", color: "bg-blue-100 text-blue-700" },
];

const Pages = {
  AccidentsAttended: ReportsTable, // Actualmente muestra la tabla de reportes
  NewAccidents: ReportsNewAccidents, // Cambia el contenido más tarde
  PeopleConnected: ReportsTable, // Cambia el contenido más tarde
};

const ReportsView: React.FC = () => {
  // Estado inicial para la página activa (AccidentsAttended carga ReportsTable)
  const [currentPage, setCurrentPage] = useState<keyof typeof Pages>("AccidentsAttended");

  // Componente dinámico actual basado en el estado
  const CurrentPageComponent = Pages[currentPage];

  return (
    <div>
      {/* Navbar Dinámico */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const isActive = currentPage === stat.title.replace(" ", "");
          return (
            <button
              key={stat.title}
              className={`p-4 rounded-lg shadow-md ${stat.color} ${isActive ? 'bg-opacity-80 dark:bg-opacity-90 border-2 border-blue-500' : 'hover:bg-gray-200'}`}
              onClick={() => setCurrentPage(stat.title.replace(" ", "") as keyof typeof Pages)}
            >
              <h3 className="text-lg font-bold">{stat.title}</h3>
              {stat.value && <p className="text-2xl">{stat.value}</p>}
            </button>
          );
        })}
      </div>

      {/* Contenido de la Página */}
      <div className="bg-white p-6 rounded-lg shadow">
        <CurrentPageComponent />
      </div>
    </div>
  );
};

export default ReportsView;
