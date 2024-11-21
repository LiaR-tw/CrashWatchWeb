"use client";

import Image from "next/image";
import React, { useState } from "react";
import UsersTable from "./page";

function RegisterForm({ onRegister }: { onRegister: () => void }) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Register</h1>
          <p className="text-gray-600 text-sm mt-2">Fill in the details to register your new User.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onRegister();
        }}>
          <div>
            <label htmlFor="UserName" className="block text-gray-800 font-medium">
              User Name
            </label>
            <input
              id="UserName"
              type="text"
              placeholder="Enter User name"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="surname" className="block text-gray-800 font-medium">
              Surname
            </label>
            <input
              id="surname"
              type="text"
              placeholder="Enter User surname"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-800 font-medium">
                Email
              </label>
              <input
                id="email"
                type="text"
                placeholder="Enter User Email"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-800 font-medium">
                phone
              </label>
              <input
                id="phone"
                type="text"
                placeholder="Enter User Phone"
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="institution" className="block text-gray-800 font-medium">
              Institution
            </label>
            <select
              id="inst"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="Hospital Viedma">Hospital Viedma</option>
              <option value="Sar">Sar</option>
              <option value="Policia">Policia</option>
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

export default function UserRegister() {
  const [currentView, setCurrentView] = useState<"register" | "Users">("register");

  return (
    <div>
      {currentView === "register" ? (
        <RegisterForm onRegister={() => setCurrentView("Users")} />
      ) : (
        <UsersTable />
      )}
    </div>
  );
}
