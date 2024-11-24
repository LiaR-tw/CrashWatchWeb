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
import { useRouter } from "next/navigation";

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
  const [currentView, setCurrentView] = useState<ViewType>("institutions"); // Default view set to institutions
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

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
  }, [router]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Diccionario para componentes
  const viewComponents: Record<ViewType, React.ReactNode> = {
    map:null,
    accidents: <AccidentsView />,
    institutions: <InstitutionsTable />,
    reports: <ReportsView />,
    Register: <Register />,
    ChangePassword: <div>Change Password Component Placeholder</div>,
    Users: <UsersTable />,
    Profile: <Profile />,
  };

  // Función para cambiar la vista
  const changeView = (view: ViewType) => {
    setCurrentView(view);
  };

  return (
    <div className="flex min-h-screen bg-cover bg-fixed">
      {/* Sidebar */}
      <Sidebar onChangeView={changeView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 bg-white p-6 rounded-tl-3xl rounded-bl-3xl shadow-lg">
        <Header />
        <div className="px-8 py-6 bg-white rounded-lg shadow-md">
          {/* Map is always rendered */}
          <div style={{ display: currentView === "map" ? "block" : "none" }}>
            <MapView /> {/* El mapa solo será visible si currentView es "map" */}
          </div>

          {/* Renderizamos las vistas que no son el mapa */}
          {currentView !== "map" && viewComponents[currentView]}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
