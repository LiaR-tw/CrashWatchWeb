"use client";

import React, { useState } from "react";

// Definición del tipo NewAccident
type NewAccident = {
  id: number;
  title: string;
  date: string;
  status: "Pending" | "Resolved";
};

// Datos de los accidentes nuevos
const newAccidents: NewAccident[] = [
  { id: 1, title: "Minor Collision", date: "2024-11-05", status: "Pending" },
  { id: 2, title: "Vehicle Breakdown", date: "2024-11-06", status: "Resolved" },
  { id: 3, title: "Road Obstruction", date: "2024-11-07", status: "Pending" },
];

// Componente para mostrar la tabla de accidentes nuevos y detalles dinámicos
const ReportsNewAccidents: React.FC = () => {
  // Estado para manejar el accidente seleccionado
  const [selectedAccident, setSelectedAccident] = useState<NewAccident | null>(null);

  return (
    <div className="mt-6">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4">New Accidents</h2>

      {/* Contenedor principal */}
      <div className="flex">
        {/* Tabla de nuevos accidentes */}
        <div className={`w-${selectedAccident ? "2/3" : "full"} transition-all`}>
          <table className="min-w-full bg-white rounded-lg shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">ID</th>
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Date</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newAccidents.map((accident) => (
                <tr key={accident.id} className="border-b">
                  <td className="py-2 px-4">{accident.id}</td>
                  <td className="py-2 px-4">{accident.title}</td>
                  <td className="py-2 px-4">{accident.date}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        accident.status === "Resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {accident.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setSelectedAccident(accident)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalles dinámicos del accidente */}
        {selectedAccident && (
          <div className="w-1/3 bg-gray-50 p-4 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Accident Details</h3>
            <p><strong>ID:</strong> {selectedAccident.id}</p>
            <p><strong>Title:</strong> {selectedAccident.title}</p>
            <p><strong>Date:</strong> {selectedAccident.date}</p>
            <p><strong>Status:</strong> {selectedAccident.status}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setSelectedAccident(null)}
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsNewAccidents;
