"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import InstitutionsTable from "./Institutions/InstitutionsTable";
import ReportsView from "./Reports/ReportsView";
import Register from "./Institutions/RegisterInstitution";
import AccidentsView from "./Accidents/page";
import MapView from "./Map/page";
import UsersTable from "./Users/page";
import Profile from "./Profile/page";
import { useRouter } from "next/navigation"; // Importar useRouter para redirección

type ViewType =
  | "map"
  | "accidents"
  | "institutions"
  | "reports"
  | "Register"
  | "ChangePassword"
  | "Users"
  | "Profile";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("map");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Hook para redirigir
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Para verificar la autenticación

  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const response = await fetch("http://localhost:3005/user/dashboard", {
          method: "GET",
          credentials: "include", // Enviar cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Datos protegidos:", data);
          setIsAuthenticated(true); // Usuario autenticado
        } else if (response.status === 401 || response.status === 403) {
          setIsAuthenticated(false); // Usuario no autenticado
          setError("No autorizado o token inválido");
          router.push("/Login"); // Redirigir al login
        } else {
          setError("Error desconocido");
        }
      } catch (err) {
        console.error("Error al obtener datos protegidos:", err);
        setError("Error de conexión al servidor");
        setIsAuthenticated(false); // Usuario no autenticado
        router.push("/Login"); // Redirigir al login
      }
    };

    fetchProtectedData();
  }, [router]); // Solo se ejecuta al montar el componente

  // Si aún no se ha verificado la autenticación, mostrar un estado de carga
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Diccionario para componentes
  const viewComponents: Record<ViewType, React.ReactNode> = {
    map: <MapView />,
    accidents: <AccidentsView />,
    institutions: <InstitutionsTable />,
    reports: <ReportsView />,
    Register: <Register />,
    ChangePassword: <div>Change Password Component Placeholder</div>, // Agrega el componente cuando esté listo
    Users: <UsersTable />,
    Profile: <Profile />,
  };

  return (
    <div className="flex min-h-screen bg-cover bg-fixed">
      {/* Sidebar */}
      <Sidebar onChangeView={setCurrentView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-white p-6 rounded-tl-3xl rounded-bl-3xl shadow-lg">
        <Header />
        <div className="px-8 py-6 bg-white rounded-lg shadow-md">
          {/* Render dinámico basado en la vista actual */}
          {viewComponents[currentView] || <div>Vista no encontrada</div>}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
