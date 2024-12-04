
import React, { useState, useEffect, useCallback } from "react";
import InstitutionsTable from "./InstitutionsTable";
import { GoogleMap,  Marker } from "@react-google-maps/api";
function RegisterForm({ onRegister }: { onRegister: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "1",  // Establecer 1 como valor predeterminado
    idInstitutionType: "", // Default value
    idCounty: "", // Will be set from dynamic data
  });
  

  const [counties, setCounties] = useState<{ id: string; name: string }[]>([]);
  const [institutionTypesAvailable, setInstitutionTypesAvailable] = useState<{ id: string; name: string }[]>([]);

  // Initial center configuration (you can keep this as default)
  const [center, setCenter] = useState({ lat: -17.38333333, lng: -66.16666667 }); // Default center


  // Fetch counties data (example of dynamic data for the select)
  useEffect(() => {
    const fetchCounties = async () => {
      const response = await fetch("http://localhost:3005/counties"); // Replace with actual API endpoint
      const data = await response.json();
      setCounties(data);
    };
    fetchCounties();
  }, []);

  useEffect(() => {
    const fetchInstitutionTypes = async () => {
      const response = await fetch("http://localhost:3005/institutionTypes"); // Replace with actual API endpoint
      const data = await response.json();
      setInstitutionTypesAvailable(data);
    };
    fetchInstitutionTypes();
  }, []);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Function to handle map clicks, update latitude, longitude, and center the map at the clicked location
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;
  
    // Actualizar formData con nuevas coordenadas
    setFormData({
      ...formData,
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  
    // Actualizar el centro del mapa a la ubicación seleccionada
    setCenter({ lat, lng });
  }, [formData]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Validación de los campos
    if (!formData.name || !formData.description || !formData.phone || !formData.address) {
      alert("Por favor, completa todos los campos requeridos.");
      return;
    }
  
    if (!formData.latitude || !formData.longitude) {
      alert("Por favor, selecciona una ubicación en el mapa.");
      return;
    }
  
    if (!formData.idInstitutionType || !formData.idCounty) {
      alert("Por favor, selecciona el tipo de institución y el condado.");
      return;
    }
  
    // Prepare the data for the POST request
    const payload = {
      name: formData.name,
      description: formData.description,
      phone: formData.phone,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,  // Ya tiene valor por defecto
      idInstitutionType: formData.idInstitutionType,
      idCounty: formData.idCounty,
    };
  
    try {
      const response = await fetch("http://localhost:3005/institutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        console.log("Institution registered successfully");
        onRegister(); // Llama a la función onRegister para actualizar la lista
      } else {
        alert("Error al registrar la institución. Intenta nuevamente.");
      }
    } catch (error) {
      console.error("Error registering institution:", error);
      alert("Error al registrar la institución.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Institutional Register</h1>
          <p className="text-gray-600 text-sm mt-2">Fill in the details to register your institution.</p>
        </div>
      
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-800 font-medium">
              Institutional Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter institution name"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-gray-800 font-medium">
              Description
            </label>
            <input
              id="description"
              type="text"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter institution description"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-gray-800 font-medium">
              Phone
            </label>
            <input
              id="phone"
              type="number"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter institution phone"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-gray-800 font-medium">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter institution address"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
             
        
      
      
        </div>
        <div>
          <h3>Select Location</h3>
    
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={center} // Map will center based on the `center` state
            zoom={12}
            onClick={handleMapClick} // Update lat/lng on map click
          >
            <Marker position={center} /> {/* Marker placed at the clicked position */}
          </GoogleMap>
       
        </div>

        {/* Latitude and Longitude Display */}
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
            <label htmlFor="idInstitutionType" className="block text-gray-800 font-medium">
              Institution Type
            </label>
            <select
              id="idInstitutionType"
              value={formData.idInstitutionType}
              onChange={handleSelectChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="">Select Institution Type</option>
              {institutionTypesAvailable.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idCounty" className="block text-gray-800 font-medium">
              County
            </label>
            <select
              id="idCounty"
              name="idCounty"
              value={formData.idCounty}
              onChange={handleSelectChange}
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

          <button
            type="submit"
            className="w-full bg-[#5932EA] text-white py-3 rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default function Register() {
  const [currentView, setCurrentView] = useState<"register" | "institutions">("register");

  return (
    <div>
      {currentView === "register" ? (
        <RegisterForm onRegister={() => setCurrentView("institutions")} />
      ) : (
        <InstitutionsTable />
      )}
    </div>
  );
}