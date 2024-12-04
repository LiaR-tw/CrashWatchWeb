"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./SideBar";
import Header from "./Header";
import ReportsView from "./Reports/ReportsView";
import AccidentsView from "./Accidents/page";
import MapView from "./Map/page";
import Profile from "./Profile/page";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";

type ViewType = "map" | "accidents" | "reports" | "ChangePassword" | "Profile";

const Dashboard: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("map"); // Vista predeterminada es 'map'
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Comprobar si el token existe en localStorage
    const storedToken = localStorage.getItem("authToken");

    if (!storedToken) {
      setIsAuthorized(false);
      router.replace("/Login"); // Redirigir si no hay token
      return;
    }

    // Decodificar el token JWT para obtener el rol del usuario
    try {
      const decodedToken: any = jwtDecode(storedToken);
      const userRole = decodedToken?.rol;

      if (!userRole) {
        setError("No role found in token");
        setIsAuthorized(false);
        router.replace("/Login");
        return;
      }

      // Verificar el rol del usuario y redirigir según corresponda
      if (userRole === "Ciudadano") {
        setIsAuthorized(false);
        router.replace("/NoAccess");
      } else if (userRole === "Institucional") {
        setIsAuthorized(false); // Cambiar a la vista de instituciones
      } else if (userRole === "Administrativo") {
        setIsAuthorized(true); // Cambiar a la vista de reportes
        router.replace("/NoAccess");
      } else {
        setError("Rol no reconocido");
        setIsAuthorized(false);
        router.replace("/NoAccess");
      }
    } catch (error) {
      console.error("Error decodificando el token:", error);
      setError("Token inválido");
      setIsAuthorized(false);
      router.replace("/NoAccess");
    }
  }, [router]);
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
