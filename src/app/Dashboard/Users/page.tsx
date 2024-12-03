"use client";

import React, { useState, useEffect } from "react";
import UserRegister from "./UserRegister";

type User = {
  name: string;
  lastname: string;
  email: string;
  ci: string;
  phone: string;
  username: string;
  rol: string;
  status:string;
};

const UsersTable: React.FC = () => {
  
  const [currentView, setCurrentView] = useState<string>("table");
  const [filter, setFilter] = useState<string>("All"); // Estado para el filtro
  const [institutionTypes, setInstitutionTypes] = useState<string[]>([]); // Estado para los tipos de institución
  const [users, setUsers] = useState<User[]>([]); // Estado para los usuarios obtenidos desde la API

  // Obtener usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3005/users"); // Cambia la URL si es necesario
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        setUsers(
          data.map((user: any) => ({
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            ci: user.ci,
            phone: user.phone,
            username: user.username,
            rol: user.rol, // Ajusta aquí si el campo no es directamente `rol`
            status: user.status,
          }))
        ); // Asignamos los usuarios obtenidos al estado
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchUsers();
  }, []);
  const handleRegister = () => {};

  // Filtrar los usuarios según el valor seleccionado
  const filteredUsers = filter === "All" ? users : users.filter((user) => user.rol === filter);

  // Obtener los tipos de institución desde la API
  useEffect(() => {
    const fetchInstitutionTypes = async () => {
      try {
        const response = await fetch("http://localhost:3005/institutionsAvailable");
        if (!response.ok) {
          throw new Error("Failed to fetch institution types.");
        }
        const data = await response.json();
        
        if (Array.isArray(data)) {
          const institutionNames = data.map((institution: { name: string }) => institution.name);
          setInstitutionTypes(institutionNames);
        } else {
          console.error("Datos inesperados:", data);
        }
      } catch (error) {
        console.error("Error fetching institution types:", error);
      }
    };
  
    fetchInstitutionTypes();
  }, []);

  const renderContent = () => {
    if (currentView === "table") {
      return (
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">All Users</h2>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-4 py-2 w-1/3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select
              value={filter} // Asociar el estado con el valor del select
              onChange={(e) => setFilter(e.target.value)} // Actualizar el estado cuando se selecciona un valor
              className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All</option>
              {institutionTypes.map((type, index) => (
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
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Ci</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Rol</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="py-3 px-6">{user.name} {user.lastname}</td>
                  <td className="py-3 px-6">{user.email}</td>
                  <td className="py-3 px-6">{user.ci}</td>
                  <td className="py-3 px-6">{user.phone}</td>
                  <td className="py-3 px-6">{user.username}</td>
                  <td className="py-3 px-6">{user.rol}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        user.status === "Active" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                      }`}
                    >
                      {user.status}
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
              Register User
            </button>
          </div>
        </div>
      );
    } else if (currentView === "register") {
      return <UserRegister onRegister={handleRegister}/>;
    }
  };

  return <div className="px-8 py-6">{renderContent()}</div>;
};

export default UsersTable;
