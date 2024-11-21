"use client";
import React from "react";

// Definir las propiedades del Sidebar
interface SidebarProps {
  onChangeView: (
    view: "institutions" | "reports" | "map" | "Register" | "ChangePassword"
  ) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onChangeView }) => {
  return (
    <div className="fixed left-0 top-0 w-64 bg-[#1e3a8a] text-white shadow-lg h-screen flex flex-col z-10">
      {/* Título Crash Watcher */}
      <div className="p-4 font-extrabold text-4xl text-white border-b border-white shadow-md">
        Crash Watcher
      </div>

      {/* Botón de perfil debajo del título */}
      <div className="p-4 cursor-pointer hover:bg-gray-200 mt-2 mb-4">
        <button
          onClick={() => {
            // Lógica para ver o editar datos del usuario, puede ser un modal o navegación
            alert("Ver perfil");
          }}
          className="flex items-center space-x-2 bg-gray-300 hover:bg-gray-400 text-black p-2 rounded-full shadow-md"
        >
          {/* Aquí puedes poner una imagen de usuario si la tienes */}
          <img src="path-to-your-user-image.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
          <span>Ver Perfil</span>
        </button>
      </div>

      {/* Lista de opciones */}
      <ul className="flex-1">
        {[{
          label: "Map", view: "map"
        }, {
          label: "Institutions", view: "institutions"
        }, {
          label: "Reports", view: "reports"
        }, {
          label: "Institutional Register", view: "Register"
        }, {
          label: "Change Password", view: "ChangePassword"
        }].map((item) => (
          <li
            key={item.view}
            className="p-4 cursor-pointer hover:bg-gray-200"
            onClick={() => onChangeView(item.view as any)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
