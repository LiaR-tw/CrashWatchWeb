"use client";

import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import UsersTable from "./page";

type County = {
  id: string;
  name: string;
};

type Role = {
  id: string;
  name: string;
};
type Institucion = {
  id: number; // ID de la institución
  name: string; // Nombre de la institución

};


function RegisterForm({ onRegister }: { onRegister: () => void }) {
  
  const [counties, setCounties] = useState<County[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [institutions, setInstitutions] = useState<Institucion[]>([]);  // Estado para almacenar las instituciones

  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    ci: "",
    phone: "",
    username: "",
    password: "",
    status: "1", // Valor por defecto
    latitude: "",
    longitude: "",
    idCounty: "",
    idRol: "",
    idInstitution : "", // Aquí cambiaste de "=" a ":"

  });

  const [center, setCenter] = useState({ lat: -17.38333333, lng: -66.16666667 });

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;

    setFormData(prevFormData => ({
      ...prevFormData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));

    setCenter({ lat, lng });
  }, []);

  // Obtener los países y roles desde la API
  useEffect(() => {
    // Llamada a las APIs de "counties", "roles" e "institutions"
    const fetchData = async () => {
      try {
        // Llamadas a la API de counties y roles
        const countyResponse = await fetch("http://localhost:3005/counties");
        const roleResponse = await fetch("http://localhost:3005/roles");
        const institutionResponse = await fetch("http://localhost:3005/institutions"); // Cambié la URL a /institutions

        if (!countyResponse.ok || !roleResponse.ok || !institutionResponse.ok) {
          throw new Error("Failed to fetch counties, roles, or institutions.");
        }

        // Parsear las respuestas JSON
        const countiesData = await countyResponse.json();
        const rolesData = await roleResponse.json();
        const institutionsData = await institutionResponse.json(); // Aquí obtienes las instituciones

        // Actualizar el estado con los datos obtenidos
        setCounties(countiesData);
        setRoles(rolesData);
        setInstitutions(institutionsData); // Asignamos las instituciones al estado
      } catch (error) {
        console.error("Error fetching counties, roles, or institutions:", error);
      }
    };

    fetchData(); // Llamamos a la función para obtener los datos
  }, []); 

  const [showInstitutionSelect, setShowInstitutionSelect] = useState(false); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      
    });
    if (name === "idRol" && value === "4") { // "3" es el ID del rol "Institucional"
      setShowInstitutionSelect(true); // Mostrar el combobox de institución
    } else if (name === "idRol") {
      setShowInstitutionSelect(false); // Ocultar el combobox de institución si no es "Institucional"
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación de los campos
    if (!formData.name || !formData.lastname || !formData.email || !formData.ci || !formData.phone || !formData.username || !formData.password) {
        alert("Por favor, completa todos los campos requeridos.");
        return;
    }

    if (!formData.latitude || !formData.longitude) {
        alert("Por favor, selecciona una ubicación en el mapa.");
        return;
    }

    if (!formData.idCounty || !formData.idRol ) {
        alert("Por favor, selecciona el condado, el rol ");
        return;
    }
    if (!formData.idInstitution ) {
      alert("Por favor, selecciona la Institucion ");
      return;
  }
    // Prepare the data for the POST request
    const payload = {
        name: formData.name,
        lastname: formData.lastname,
        email: formData.email,
        ci: formData.ci,
        phone: formData.phone,
        username: formData.username,
        password: formData.password,
        status: formData.status,  // Ya tiene valor por defecto
        latitude: formData.latitude,
        longitude: formData.longitude,
        idCounty: formData.idCounty,
        idRol: formData.idRol,
        idInstitution: formData.idInstitution || null,  // El ID de la institución, puede ser null
       
    };

    try {
        const response = await fetch("http://localhost:3005/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        // Verificar si la respuesta fue exitosa
        if (response.ok) {
            console.log("Usuario registrado exitosamente");
            onRegister(); // Llama a la función onRegister para actualizar la lista
        } else {
            const errorData = await response.json(); // Obtener el mensaje de error del servidor
            alert(errorData.message || "Error al registrar el usuario. Intenta nuevamente.");
        }
    } catch (error) {  
        console.error("Error al registrar el usuario:", error);
        alert("Error al registrar el usuario. Intenta nuevamente.");
    }
};

  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Register</h1>
          <p className="text-gray-600 text-sm mt-2">Fill in the details to register your new User.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-800 font-medium">
              Name:
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-gray-800 font-medium">
              Surname:
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Enter User surname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-gray-800 font-medium">
              Username:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter User name"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-800 font-medium">
                Email:
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter User Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-800 font-medium">
                Phone:
              </label>
              <input
                id="phone"
                name="phone"
                type="number"
                placeholder="Enter User Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ci" className="block text-gray-800 font-medium">
              CI:
            </label>
            <input
              id="ci"
              name="ci"
              type="text"
              placeholder="Enter User CI"
              value={formData.ci}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-800 font-medium">
              Password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter User Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

        
          <h3>Select Location:</h3>
    
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={center}
          zoom={12}
          onClick={handleMapClick} // Correctly passing the onClick handler
        >
          <Marker position={center} />
        </GoogleMap>
      

      <div>
        <label htmlFor="latitude">Latitude</label>
        <input
          id="latitude"
          type="text"
          value={formData.latitude}
          readOnly
        />
      </div>

      <div>
        <label htmlFor="longitude">Longitude</label>
        <input
          id="longitude"
          type="text"
          value={formData.longitude}
          readOnly
        />
      </div>
        

          <div>
            <label htmlFor="idCounty" className="block text-gray-800 font-medium">
              Select County:
            </label>
            <select
              id="idCounty"
              name="idCounty"
              value={formData.idCounty}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idRol" className="block text-gray-800 font-medium">
              Select Role:
            </label>
            <select
              id="idRol"
              name="idRol"
              value={formData.idRol}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {showInstitutionSelect && ( // Solo mostrar este bloque si el rol es "Institucional"
            <>
              <label htmlFor="idInstitution" className="block text-gray-800 font-medium">
                Select institution to which you belong:
              </label>
              <select
                id="idInstitution"
                name="idInstitution" // Asegúrate de que coincida con el estado
                value={formData.idInstitution} // Esto asegura que el valor seleccionado esté reflejado en el estado
                onChange={handleChange} // Llama al handler de cambio
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              >
                <option value="">Select an Institution</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </>
          )}
          <button
            type="submit"
            className="w-full mt-6 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Register
          </button>
          <div>
      </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
