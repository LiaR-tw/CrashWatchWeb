"use client";

import React, { useState } from "react";
import InstitutionsTable from "./InstitutionsTable";

function RegisterForm({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Institutional Register</h1>
          <p className="text-gray-600 text-sm mt-2">Fill in the details to register your institution.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onRegister();
        }}>
          <div>
            <label htmlFor="institutionName" className="block text-gray-800 font-medium">
              Institutional Name
            </label>
            <input
              id="institutionName"
              type="text"
              placeholder="Enter institution name"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-gray-800 font-medium">
              Location
            </label>
            <input
              id="location"
              type="text"
              placeholder="Enter institution location"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-gray-800 font-medium">
                Latitude
              </label>
              <input
                id="latitude"
                type="text"
                placeholder="e.g., -17.3936"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-gray-800 font-medium">
                Longitude
              </label>
              <input
                id="longitude"
                type="text"
                placeholder="e.g., -66.1566"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="category" className="block text-gray-800 font-medium">
              Category
            </label>
            <select
              id="category"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="Health">Health</option>
              <option value="Police">Police</option>
              <option value="Firefighters">Firefighters</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#5932EA] text-white py-3 rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Register() {
  const [currentView, setCurrentView] = useState<"register" | "institutions">("register");

  return (
    <div>
      {currentView === "register" ? (
        <RegisterForm onRegister={() => setCurrentView("institutions")} />
      ) : (
        <InstitutionsTable />
      )}
    </div>
  );
}
