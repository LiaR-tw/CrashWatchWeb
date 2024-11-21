"use client";

import React, { useState } from "react";
import Register from "../Register/page";

type Institution = {
  name: string;
  type: string;
  phone: string;
  email: string;
  city: string;
  status: "Active" | "Inactive";
};

const institutions: Institution[] = [
  { name: "Univalle", type: "Hospital", phone: "+591 95566117", email: "univalle231@gmail.com", city: "Cochabamba", status: "Active" },
  { name: "Viedman", type: "Hospital", phone: "+591 95566117", email: "viedma885@yahoo.com", city: "Cochabamba", status: "Inactive" },
  { name: "Transit", type: "Police", phone: "+591 8723952", email: "ronald@adobe.com", city: "Cochabamba", status: "Inactive" },
  { name: "Comand", type: "Police", phone: "+591 7832159", email: "marvin@tesla.com", city: "Cochabamba", status: "Active" },
  { name: "Sar", type: "Firefighters", phone: "+10 97881541", email: "jerome@google.com", city: "Santa Cruz", status: "Active" },
];

const InstitutionsTable: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("table");

  const renderContent = () => {
    if (currentView === "table") {
      return (
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">All Institutions</h2>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-4 py-2 w-1/3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
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
              {institutions.map((institution, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="py-3 px-6">{institution.name}</td>
                  <td className="py-3 px-6">{institution.type}</td>
                  <td className="py-3 px-6">{institution.phone}</td>
                  <td className="py-3 px-6">{institution.email}</td>
                  <td className="py-3 px-6">{institution.city}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        institution.status === "Active" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
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
              onClick={() => setCurrentView("register")} // Cambiar a la vista del registro
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
