"use client";

import React, { useState, useEffect } from "react";
import UserRegister from "./UserRegister";

type User = {
  id:number,
  name: string;
  lastname: string;
  email: string;
  ci: string;
  phone: string;
  username: string;
  rol: string;
  institution: string; 
  status:string;

};

const UsersTable: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("table");
  const [filter, setFilter] = useState<string>("All"); // Estado para el filtro
  const [institutionTypes, setInstitutionTypes] = useState<string[]>([]); // Estado para los tipos de institución
  const [users, setUsers] = useState<User[]>([]); // Estado para los usuarios obtenidos desde la API
  const [showModal, setShowModal] = useState(false); 
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null); // ID del usuario a eliminar

  // Obtener usuarios desde la API
  
  const handleRegister = () => {
    setCurrentView("usersTable"); // Cambia a UsersTable después del registro
  };

  // Filtrar los usuarios según el valor seleccionado
  const filteredUsers = filter === "All" ? users : users.filter((user) => user.rol === filter);
 
  // Obtener usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3005/users12"); // Cambia la URL si es necesario
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        setUsers(
          data.map((user: any) => ({
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            ci: user.ci,
            phone: user.phone,
            username: user.username,
            rol: user.rol, 
            institution: user.institution || "No institution", 
            status: user.status
          }))
        );
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Llama a la función para obtener usuarios

  }, [users]); // Si users cambia, volverá a llamar a la API para actualizar la lista de usuarios

  const deleteUser = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:3005/users12/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Usuario eliminado');
        setShowModal(false); // Cierra el modal
        // Re-fetch the users list after deletion
        const newUsersResponse = await fetch("http://localhost:3005/users12");
        const newUsersData = await newUsersResponse.json();
        setUsers(newUsersData); // Actualiza la lista de usuarios después de eliminar
      } else {
        const data = await response.json();
        console.error('Error:', data.message);
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };



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
              <div>

          <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Ci</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Username</th>
                <th className="py-3 px-6 text-left">Rol</th>
                <th className="border px-4 py-2">Institution</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6">Delete</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((user) => user.status === "1") // Filtra solo los usuarios con status = "1"
                .map((user, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
                    <td className="py-3 px-6">{user.name} {user.lastname}</td>
                    <td className="py-3 px-6">{user.email}</td>
                    <td className="py-3 px-6">{user.ci}</td>
                    <td className="py-3 px-6">{user.phone}</td>
                    <td className="py-3 px-6">{user.username}</td>
                    <td className="py-3 px-6">{user.rol}</td>
                    <td className="border px-4 py-2">{user.institution}</td>
                    <td className="py-3 px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.status === "1" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                        }`}
                      >
                        {user.status === "1" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                    <button
                      onClick={() => {
                        setUserIdToDelete(user.id);
                        setShowModal(true);
                      }} // Muestra el modal al hacer clic en Eliminar
                      className="text-red-600 hover:text-red-800 transition duration-200"
                    >
                      <span role="img" aria-label="Eliminar" className="text-xl">🗑️</span> 
                    </button>

                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* Modal de confirmación */}
          {showModal && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold mb-4">Are you sure you want to delete this user?</h3>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setShowModal(false)} // Cierra el modal sin eliminar
                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (userIdToDelete !== null) {
                        deleteUser(userIdToDelete); // Llama a deleteUser con el ID seleccionado
                      }
                    }}
                    className="bg-red-600 text-white py-2 px-4 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
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
