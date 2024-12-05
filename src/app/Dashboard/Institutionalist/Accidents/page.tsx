import React, { useState, useEffect } from "react";
import RequestAccident from "./RequestAccident";

const AccidentsView: React.FC = () => {
  const [selectedAccident, setSelectedAccident] = useState<number | null>(null);
  const [accidents, setAccidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  
  useEffect(() => {
    const fetchUserAndAccidents = async () => {
      try {
        setIsLoading(true);
  
        // Obtener el perfil del usuario logueado
        const userResponse = await fetch("http://localhost:3005/users/me", {
          credentials: "include", // Permite enviar cookies
        });
  
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user profile.");
        }
  
        const userData = await userResponse.json();
        setUser(userData.user);
  
        // Obtener los accidentes
        const accidentResponse = await fetch("http://localhost:3005/ReportsV");
  
        if (!accidentResponse.ok) {
          throw new Error("Failed to fetch accidents.");
        }
  
        const accidentData = await accidentResponse.json();
  
        // Filtrar accidentes por estado y por idInstitution del usuario
        const filteredAccidents = accidentData.filter((accident: any) => {
          // Validamos que `institutions` sea un array válido
          if (!accident.institutions || !Array.isArray(accident.institutions)) {
            console.error("Invalid institutions data:", accident);
            return false; // Ignoramos accidentes con instituciones inválidas
          }
        
          // Verificamos si alguna institución tiene el id que coincide con el usuario
          const hasMatchingInstitution = accident.institutions.some(
            (institution: any) => institution.id === userData.user.idInstitution
          );
        
          // Filtramos los accidentes con status 2 y que pertenezcan a la institución del usuario
          return accident.status === 2 && hasMatchingInstitution;
        });
        
        // Resultado
        console.log("Filtered Accidents:", filteredAccidents);
        setAccidents(filteredAccidents);

        console.log(filteredAccidents);
  
        setAccidents(filteredAccidents);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Error fetching data.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserAndAccidents();
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
            <div className="bg-gray-100 px-4 py-2">
              <h1 className="text-gray-800">
                Reported by: {accident.user?.name} {accident.user?.lastname || ""}
              </h1>
            </div>

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

            <div className="p-4">
              <h2 className="font-bold text-lg text-gray-800 mb-2">
                Description: {accident.description}
              </h2>
              <div className="mb-4">
                <h3 className="font-bold text-gray-800 mb-1">State:</h3>
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
                    : "Unknown"}
                </p>
              </div>

              <h3 className="font-bold text-gray-800 mb-2">Institutions:</h3>
              <ul className="list-disc pl-5 mb-4">
                {accident.institutions.map((institution: any) => (
                  <li key={institution.id} className="text-sm text-gray-600">
                    {`${institution.name} (${institution.type})`}
                  </li>
                ))}
              </ul>

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
