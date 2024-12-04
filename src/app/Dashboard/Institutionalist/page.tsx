"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import ReportsView from "./Reports/ReportsView";
import AccidentsView from "./Accidents/page";
import MapView from "./Map/page";
import Profile from "./Profile/page";
import { useRouter } from "next/navigation";

type ViewType = "map" | "accidents" | "reports" | "ChangePassword" | "Profile";

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("map"); // Vista predeterminada es 'map'
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:3005/users/me", {
          method: "GET",
          credentials: "include", // Enviar cookies
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Datos del usuario:", data); // Depuración

          // Verificar si el usuario tiene el rol "Institucional"
          if (data.rol === "Institucional") {
            setIsAuthorized(true);
            setIsAuthenticated(true); // Asegúrate de marcar como autenticado
          } else {
            setIsAuthorized(false);
            setError("No tienes permisos para acceder a esta página");
            router.push("/Unauthorized"); // Redirigir a una página de no autorizado
          }
        } else if (response.status === 401 || response.status === 403) {
          setIsAuthorized(false);
          setError("No autorizado o token inválido");
          router.push("/Login"); // Redirigir al login
        } else {
          setError("Error desconocido");
        }
      } catch (err) {
        console.error("Error al obtener datos protegidos:", err);
        setError("Error de conexión al servidor");
        setIsAuthorized(false);
        router.push("/Login"); // Redirigir al login
      }
    };

    fetchUserRole();
  }, [router]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg">{error || "Acceso no autorizado"}</p>
      </div>
    );
  }

  // Diccionario para los componentes según la vista
  const viewComponents: Record<ViewType, React.ReactNode> = {
    map: <MapView />,  // El mapa siempre está visible
    accidents: <AccidentsView />,
    reports: <ReportsView />,
    ChangePassword: <div>Change Password Component Placeholder</div>,
    Profile: <Profile />,
  };

  // Función para cambiar de vista
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
          {/* El mapa solo se muestra si currentView es "map" */}
          <div style={{ display: currentView === "map" ? "block" : "none" }}>
            <MapView />
          </div>

          {/* Renderizar las vistas que no son el mapa */}
          {currentView !== "map" && viewComponents[currentView]}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
