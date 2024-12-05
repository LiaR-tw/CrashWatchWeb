"use client";

import React, { useState,useEffect } from "react";


type Accident = {
  id: number;
  reporter: string;
  institution: string | null;
  location: string;
  time: string;
  accidentTypes: string[];
  status:number;
};
const ReportsNewAccidents: React.FC = () => {
  const [reports, setReports] = useState<Accident[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:3005/ReportsAcidentes"); // Cambia la URL según corresponda
        if (!response.ok) throw new Error("Failed to fetch reports.");
        const data = await response.json();

        // Mapear los datos para mostrar solo la información requerida
        const mappedReports = data.map((report: any) => ({
          id: report.id,
          reporter: `${report.user?.name || "Desconocido"} ${report.user?.lastname || ""}`, // Concatenamos el nombre y apellido
          institution: report.institutions?.[0]?.name || "Sin institución asignada", // Solo tomamos la primera institución
          location: `${report.latitude}, ${report.longitude}`, // Formateamos la ubicación
          time: report.registerDate, // Fecha de registro
          accidentTypes: report.accidentTypes?.map((type: any) => type.name) || ["Sin tipo"], // Mapeamos los tipos de accidentes a un arreglo de strings
          status: report.status, // Status del accidente
        }));

        setReports(mappedReports); // Actualizamos el estado con los reportes mapeados
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Error al cargar los reportes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (isLoading) {
    return <div className="text-center text-lg font-semibold">Charging...</div>;
  }
  return (
    <div className="mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">New Accidents</h2>

      <div className="mt-6">

      <div className="w-full">
        <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
            <tr>            
      
            <th className="px-4 py-2">Reporter</th>
            <th className="px-4 py-2">Institution</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Accident Types</th>
            <th className="px-4 py-2">Status</th>

            </tr>
          </thead>
          <tbody>
              {reports
                .filter(report => report.status === 2) // Filtramos los reportes con status 1
                .map((report) => (
                  <tr key={report.id}>
                
                    <td className="border px-4 py-2">{report.reporter}</td>
                    <td className="border px-4 py-2">{report.institution}</td>
                    <td className="border px-4 py-2">{report.location}</td>
                    <td className="border px-4 py-2">{report.time}</td>
                    <td className="border px-4 py-2">{report.accidentTypes.join(', ')}</td>
                    <td className="border px-4 py-2">
                      {report.status === 2 ? 'In Progress' : report.status}
                    </td>
                  </tr>
                ))}
            </tbody>

        </table>
      </div>
    </div>
    </div>
  );
};

export default ReportsNewAccidents;
