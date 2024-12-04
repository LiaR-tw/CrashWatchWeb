"use client";

import React, { useEffect, useState } from "react";
import Register from "./RegisterInstitution";

type Institution = {
  name:string ;
  phone:number ;
  address:string ;
  latitude:number ;
  longitude: number;
  status:number ;
  type:string;
  county:string;
};

const InstitutionsTable: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("table");
  const [filterType, setFilterType] = useState<string>("");
  const [types, setTypes] = useState<string[]>([]); // Guardará los tipos de institución
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Llamada al API para obtener los tipos de institución
  useEffect(() => {
    const fetchInstitutionTypes = async () => {
      try {
        const response = await fetch("http://localhost:3005/institutionTypesAvailable");
        if (!response.ok) throw new Error("Failed to fetch institution types.");
        const data = await response.json();
        console.log(data); // Verifica la estructura de los datos
        // Si es un array de objetos, extrae los nombres de los tipos
        if (Array.isArray(data)) {
          const typeNames = data.map((type: { name: string }) => type.name);
          setTypes(typeNames); // Asegúrate de que categories sea un array de strings
        } else {
          console.error("Datos inesperados:", data);
        }
      } catch (err) {
        console.error("Error fetching institution types:", err);
        setError("Error fetching institution types.");
      }
    };
  
    fetchInstitutionTypes();

    // Llamar a las funciones para obtener instituciones y tipos de institución
    const fetchInstitutions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3005/institutions");
        if (!response.ok) throw new Error("Failed to fetch institutions.");
        const data = await response.json();
        setInstitutions(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching institutions.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstitutionTypes();
    fetchInstitutions();
  }, []);

  const filteredInstitutions = institutions.filter((institution) =>
    filterType ? institution.type === filterType : true
  );

  const renderContent = () => {
    if (currentView === "table") {
      if (isLoading) {
        return <p className="text-center text-gray-500">Loading institutions...</p>;
      }

      if (error) {
        return <p className="text-center text-red-500">{error}</p>;
      }

      return (
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">All Institutions</h2>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-4 py-2 w-1/3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={(e) => setFilterType(e.target.value)}
              value={filterType}
            >
              <option value="">All</option>
              {types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Address</th>
                <th className="py-3 px-6 text-left">City</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
            {filteredInstitutions
  .filter((institution) => institution.status === 1) // Filtra solo las instituciones con status 1
  .map((institution, index) => (
    <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
      <td className="py-3 px-6">{institution.name}</td>
      <td className="py-3 px-6">{institution.type}</td>
      <td className="py-3 px-6">{institution.phone}</td>
      <td className="py-3 px-6">{institution.address}</td>
      <td className="py-3 px-6">{institution.county}</td>
      <td className="py-3 px-6">
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            institution.status === 1
              ? "bg-green-200 text-green-700"
              : "bg-red-200 text-red-700"
          }`}
        >
          {institution.status === 1 ? "Active" : "Inactive"}
        </span>
      </td>
    </tr>
  ))}


              
            </tbody>
          </table>
          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentView("register")}
              className="bg-[#4F46E5] text-white px-6 py-3 rounded-lg hover:bg-[#6B7AE8] transition-colors duration-300"
            >
              Register Institution
            </button>
          </div>
        </div>
      );
    } else if (currentView === "register") {
      return <Register />;
    }
  };

  return <div className="px-8 py-6">{renderContent()}</div>;
};

export default InstitutionsTable;
