"use client";

import React, { useEffect, useState } from "react";
import Register from "./RegisterInstitution";

type Institution = {
  name: string;
  type: string;
  phone: string;
  email: string;
  city: string;
  status: "Active" | "Inactive";
};

const InstitutionsTable: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("table");
  const [filterType, setFilterType] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]); // Manejo dinámico de instituciones
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3005/institutions");
        if (!response.ok) throw new Error("Failed to fetch institutions.");
        const data = await response.json();
        setInstitutions(Array.isArray(data) ? data : []); // Asegura que sea un array
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Error fetching institutions.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3005/categories");
        if (!response.ok) throw new Error("Failed to fetch categories.");
        const data = await response.json();
        setCategories(data.map((category: any) => category.name)); // Ajusta "name" según tu API
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };

    fetchInstitutions();
    fetchCategories();
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
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
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
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">City</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredInstitutions.map((institution, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="py-3 px-6">{institution.name}</td>
                  <td className="py-3 px-6">{institution.type}</td>
                  <td className="py-3 px-6">{institution.phone}</td>
                  <td className="py-3 px-6">{institution.email}</td>
                  <td className="py-3 px-6">{institution.city}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        institution.status === "Active"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                    >
                      {institution.status}
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
