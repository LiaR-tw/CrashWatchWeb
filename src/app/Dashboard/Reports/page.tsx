"use client";

import React, { useState } from "react";

// Definición del tipo Report
type Report = {
  id: number;
  title: string;
  date: string;
  status: "Pending" | "Completed";
};

// Datos de los reportes
const reports: Report[] = [
  { id: 1, title: "Annual Report 2024", date: "2024-10-15", status: "Completed" },
  { id: 2, title: "Incident Report", date: "2024-10-20", status: "Pending" },
  { id: 3, title: "Monthly Analysis", date: "2024-11-01", status: "Completed" },
];

// Componente para mostrar la tabla y los detalles dinámicos
const ReportsTable: React.FC = () => {
  // Estado para manejar el reporte seleccionado
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="mt-6">
      {/* Título */}
      <h2 className="text-2xl font-bold mb-4">Reports</h2>

      {/* Contenedor principal */}
      <div className="flex">
        {/* Tabla de reportes */}
        <div className={`w-${selectedReport ? "2/3" : "full"} transition-all`}>
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
              {reports.map((report) => (
                <tr key={report.id} className="border-b">
                  <td className="py-2 px-4">{report.id}</td>
                  <td className="py-2 px-4">{report.title}</td>
                  <td className="py-2 px-4">{report.date}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        report.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-500 hover:underline"
                      onClick={() => setSelectedReport(report)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalles dinámicos del reporte */}
        {selectedReport && (
          <div className="w-1/3 bg-gray-50 p-4 shadow-lg">
            <h3 className="text-xl font-bold mb-4">Report Details</h3>
            <p><strong>ID:</strong> {selectedReport.id}</p>
            <p><strong>Title:</strong> {selectedReport.title}</p>
            <p><strong>Date:</strong> {selectedReport.date}</p>
            <p><strong>Status:</strong> {selectedReport.status}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              onClick={() => setSelectedReport(null)}
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTable;
