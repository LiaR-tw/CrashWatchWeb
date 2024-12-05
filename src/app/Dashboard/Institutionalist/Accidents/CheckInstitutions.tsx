import React, { useEffect, useState } from "react";
import AccidentsView from "./page";

interface Institution {
  id: number;
  name: string;
  type: string;
  city: string;
}

interface CheckInstitutionsProps {
  accidentId: number;
}

const CheckInstitutions: React.FC<CheckInstitutionsProps> = ({ accidentId }) => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitutions, setSelectedInstitutions] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAssigned, setIsAssigned] = useState<boolean>(false); // Para manejar el redireccionamiento

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        const response = await fetch("http://localhost:3005/institutionsView");
        if (!response.ok) throw new Error("Failed to fetch institutions.");
        const data = await response.json();
        const mappedData = data.map((inst: any) => ({
          id: inst.institution_id,
          name: inst.institution_name,
          type: inst.institution_type,
          city: inst.city_name,
        }));
        setInstitutions(mappedData);
      } catch (err) {
        console.error("Error fetching institutions:", err);
        setError("Error fetching institutions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelectedInstitutions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const assignInstitutions = async () => {
    const selectedIds = Object.keys(selectedInstitutions).filter(
      (id) => selectedInstitutions[parseInt(id)]
    );

    try {
      const response = await fetch("http://localhost:3005/assignInstitution", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idReport: accidentId, institutions: selectedIds }),
      });

      if (!response.ok) throw new Error("Error al asignar las instituciones.");

      const data = await response.json();
      alert("Instituciones asignadas exitosamente.");
      setIsAssigned(true); // Cambiamos el estado para redirigir
    } catch (err) {
      console.error("Error:", err);
      alert("Error al asignar las instituciones.");
    }
  };

  // Redirigir a `AccidentsView` si las instituciones se asignaron con éxito
  if (isAssigned) {
    return <AccidentsView />;
  }

  if (isLoading) {
    return <div className="text-center text-lg font-semibold">
Loading institutions...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-8 py-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center">
      Assign Institutions to the Accident
      </h1>

      <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
          <tr>
            <th className="py-3 px-6 text-left">Select</th>
            <th className="py-3 px-6 text-left">Name</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Country</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution) => (
            <tr
              key={institution.id}
              className="border-b hover:bg-gray-50 transition-all duration-200"
            >
              <td className="py-3 px-6">
                <input
                  type="checkbox"
                  checked={!!selectedInstitutions[institution.id]}
                  onChange={() => handleCheckboxChange(institution.id)}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
              </td>
              <td className="py-3 px-6">{institution.name}</td>
              <td className="py-3 px-6">{institution.type}</td>
              <td className="py-3 px-6">{institution.city}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 text-center flex justify-center gap-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
        >
       Assign Institutions
        </button>
        <button
          onClick={() => setIsAssigned(true)} // Regresar sin guardar
          className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
        >
          Cancel
        </button>
      </div>

      {/* Modal de confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
            Are you sure you assign the selected institutions?
            </h2>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)} // Cerrar el modal
                className="bg-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  assignInstitutions();
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckInstitutions;
