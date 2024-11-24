"use client";
import React, { useState } from "react";

interface SidebarProps {
  onChangeView: (
    view: "map" | "accidents" | "institutions" | "reports" | "Users" | "Profile"
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChangeView }) => {
  const [selectedView, setSelectedView] = useState<string>("map");

  const menuItems = [
    {
      label: "Map",
      view: "map",
      image: "/images/Icons/Map.png",
    },
    {
      label: "Accidents",
      view: "accidents",
      image: "/images/Icons/Danger.png",
    },
    {
      label: "Institutions",
      view: "institutions",
      image: "/images/Icons/institution.png",
    },
    {
      label: "Reports",
      view: "reports",
      image: "/images/Icons/Reports.png",
    },
    {
      label: "Users",
      view: "Users",
      image: "/images/Icons/Users.png",
    },
    {
      label: "SignOut",
      view: undefined, // No necesita view específico
      image: "/images/Icons/SignOut.png",
    },
  ];

  const handleItemClick = (view?: string) => {
    if (view === undefined) {
      handleSignOut();
    } else {
      setSelectedView(view);
      onChangeView(view as any);
    }
  };

  const handleSignOut = async () => {
    try {
      const response = await fetch("http://localhost:3005/logout", {
        method: "POST",
        credentials: "include", // Asegura que las cookies sean enviadas
      });

      if (response.ok) {
        console.log("Sesión cerrada correctamente");
        window.location.replace("/Login"); // Redirige al inicio de sesión
      } else {
        console.error("Error al cerrar sesión:", await response.text());
        alert("Hubo un problema al cerrar la sesión. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error en la solicitud de cierre de sesión:", error);
      alert("No se pudo conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <div className="fixed left-0 top-0 w-64 bg-white text-black shadow-lg h-screen flex flex-col z-10">
      <div className="p-4 font-extrabold text-4xl text-black border-b border-gray-300 shadow-md">
        Crash Watcher
      </div>

      <div className="p-4 cursor-pointer mt-2 mb-4">
        <button
          onClick={() => handleItemClick("Profile")}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-black p-2 rounded-full shadow-md"
        >
          <img
            src="/images/Icons/Avatar.png"
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>View Profile</span>
        </button>
      </div>

      <ul className="flex-1">
        {menuItems.map((item) => (
          <li
            key={item.label}
            className={`p-4 flex items-center space-x-4 cursor-pointer rounded-lg ${
              selectedView === item.view
                ? "bg-[#5932EA] text-white"
                : "hover:bg-gray-100"
            }`}
            onClick={() => handleItemClick(item.view)}
          >
            <img
              src={item.image}
              alt={`${item.label} Icon`}
              className="w-6 h-6"
            />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
