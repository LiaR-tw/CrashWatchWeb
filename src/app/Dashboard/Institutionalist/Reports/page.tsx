import React, { useState, useEffect } from "react";

type Accident = {
  id: number;
  reporter: string;
  institution: string | null;
  location: string;
  time: string;
  accidentTypes: string[];
};

const ReportsTable: React.FC = () => {
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
          reporter: `${report.user?.name || "Desconocido"} ${report.user?.lastname || ""}`,
          institution: report.institutions?.[0]?.name || "Sin institución asignada",
          location: `${report.latitude}, ${report.longitude}`,
          time: report.registerDate,
          accidentTypes: report.accidentTypes?.map((type: any) => type.name) || ["Sin tipo"],
        }));

        setReports(mappedReports);
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
    return <div className="text-center text-lg font-semibold">Cargando reportes...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Reportes de Accidentes</h2>

      <div className="w-full">
        <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
            <tr>
        
              <th className="py-3 px-6 text-left">Reportado por</th>
              <th className="py-3 px-6 text-left">Institución</th>
              <th className="py-3 px-6 text-left">Ubicación</th>
              <th className="py-3 px-6 text-left">Hora</th>
              <th className="py-3 px-6 text-left">Tipos de Accidente</th>
              <th className="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr
                key={report.id}
                className="border-b hover:bg-gray-50 transition-all duration-200"
              >
               
                <td className="py-3 px-6">{report.reporter}</td>
                <td className="py-3 px-6">{report.institution}</td>
                <td className="py-3 px-6">{report.location}</td>
                <td className="py-3 px-6">{new Date(report.time).toLocaleString()}</td>
                <td className="py-3 px-6">{report.accidentTypes.join(", ")}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Acción
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsTable;
