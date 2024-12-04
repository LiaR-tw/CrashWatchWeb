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
  const [currentView, setCurrentView] = useState<ViewType>("institutions");
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:3005/users/me", {
          method: "GET",
          credentials: "include", // Enviar cookies
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            setError("No autorizado o token inválido");
            router.push("/Login");
          } else {
            setError("Error desconocido");
          }
          setIsAuthorized(false);
          return;
        }

        const data = await response.json();

        if (data?.rol === "Administrativo") {
          setIsAuthorized(true);
        } else {
          setError("No tienes permisos para acceder a esta página");
          setIsAuthorized(false);
          router.push("/Unauthorized");
        }
      } catch (err) {
        console.error("Error al obtener datos protegidos:", err);
        setError("Error de conexión al servidor");
        setIsAuthorized(false);
        router.push("/Login");
      }
    };

    fetchUserRole();
  }, [router]);

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Verificando tus permisos...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error || "Acceso no autorizado"}</p>
      </div>
    );
  }

  // Diccionario para componentes
  const viewComponents: Record<ViewType, React.ReactNode> = {
    map: null,
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
