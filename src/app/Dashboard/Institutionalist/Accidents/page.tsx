import React, { useState, useEffect } from "react";
import RequestAccident from "./RequestAccident";

const AccidentsView: React.FC = () => {
  const [selectedAccident, setSelectedAccident] = useState<number | null>(null);
  const [accidents, setAccidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const response = await fetch("http://localhost:3005/ReportsV");
        if (!response.ok) throw new Error("Failed to fetch accidents.");
        const data = await response.json();

        // Filtrar solo los accidentes con estado 1 o 2
        const filteredAccidents = data.filter(
          (accident: any) => accident.status === 1 || accident.status === 2
        );

        setAccidents(filteredAccidents);
      } catch (err) {
        console.error("Error fetching accidents:", err);
        setError("Error fetching accidents.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccidents();
  }, []);

  const handleReadMore = (accidentId: number) => {
    setSelectedAccident(accidentId);
  };

  if (selectedAccident !== null) {
    return (
      <RequestAccident
        accidentId={selectedAccident}
        onBack={() => setSelectedAccident(null)}
      />
    );
  }

  if (isLoading) {
    return <div className="text-center text-lg font-semibold">Charging...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {accidents.map((accident) => (
          <div
            key={accident.id}
            className={`rounded-lg shadow-lg overflow-hidden border-4 ${
              accident.status === 1
                ? "border-red-500"
                : accident.status === 2
                ? "border-green-500"
                : "border-gray-300"
            }`}
          >
            {/* Nombre del usuario en la parte superior */}
            <div className="bg-gray-100 px-4 py-2">
              <h1 className="text-gray-800">
                              
                Reported by: {accident.user?.name} {accident.user?.lastname || ""}
              </h1>
            </div>

            {/* Imágenes del accidente */}
            <div className="relative h-48">
              {accident.images && accident.images.length > 0 ? (
                <img
                  src={accident.images[0]}
                  alt={`Accidente ${accident.id}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No image available
                </div>
              )}
            </div>

            {/* Detalles del accidente */}
            <div className="p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-2">
                  Description: {accident.description}
              </h2>

              {/* Estado del accidente */}
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-1">
                  State
                  :</h3>
                <p
                  className={`text-sm font-semibold ${
                    accident.status === 1
                      ? "text-red-500"
                      : accident.status === 2
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {accident.status === 1
                    ? "Not Reviewed"
                    : accident.status === 2
                    ? "Accepted"
                    : "A stranger"}
                </p>
              </div>

              {/* Instituciones */}
              <h3 className="font-bold text-gray-800 mb-2">Institutions:</h3>
              <ul className="list-disc pl-5 mb-4">
                {accident.institutions.map((institution: any) => (
                  <li key={institution.id} className="text-sm text-gray-600">
                    {`${institution.name} (${institution.type})`}
                  </li>
                ))}
              </ul>

              {/* Botón Confirmar o Ver */}
              <button
                onClick={() => handleReadMore(accident.id)}
                className={`px-4 py-2 rounded-lg ${
                  accident.status === 1
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-green-300 text-gray-700 hover:bg-green-400"
                }`}
              >
                {accident.status === 1 ? "Confirm Accident" : "View Accident"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccidentsView;
