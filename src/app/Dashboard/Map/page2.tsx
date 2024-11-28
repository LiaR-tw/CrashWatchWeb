/*import React, { useState, useEffect, useRef } from "react";
import InstitutionsTable from "./InstitutionsTable";

function RegisterForm({ onRegister }: { onRegister: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    address: "",
    latitude: "",
    longitude: "",
    status: "",
    idInstitutionType: "", // Default value
    idCounty: "", // Will be set from dynamic data
  });

  const [counties, setCounties] = useState<{ id: string; name: string }[]>([]);
  const [institutionTypesAvailable, setInstitutionTypesAvailable] = useState<{ id: string; name: string }[]>([]);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Maneja el evento de cuando el marcador se arrastra (dragend)
  const handleMarkerDragEnd = (event: any) => {
    const lat = event.latLng ? event.latLng.lat() : 0;
    const lng = event.latLng ? event.latLng.lng() : 0;

    // Actualiza las coordenadas en el estado
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
    }));
  };

  const initMap = () => {
    if (mapInstanceRef.current || !window.HWMapJsSDK || !mapContainerRef.current) {
      return;
    }

    const mapOptions = {
      center: { lat: -17.38333333, lng: -66.16666667 },
      zoom: 8,
      language: "ENG",
      sourceType: "raster",
      authOptions: { accessToken: "DQEDACk4MlhnmOmdmSVkBNDeJZ6qPhCndg2EUV5ihtAlqHuAbdy5dIY7wfMhlkZZXQc9Z8nFXfWaT3zoZ2pTOsC8soZE8pYPcSOnBQ" },
    };

    mapInstanceRef.current = new window.HWMapJsSDK.HWMap(
      mapContainerRef.current,
      mapOptions
    );

    // Verifica que el mapa se haya creado correctamente antes de agregar el listener
    if (mapInstanceRef.current) {
      markerRef.current = new window.HWMapJsSDK.HWMarker({
        map: mapInstanceRef.current,
        position: {
          lat: parseFloat(formData.latitude || "-17.38333333"),
          lng: parseFloat(formData.longitude || "-66.16666667"),
        },
        draggable: true,
        zIndex: 10,
      });

      // Agrega el listener para el evento dragend del marcador
      window.HWMapJsSDK.event.addListener(markerRef.current, "dragend", handleMarkerDragEnd);
    } else {
      console.error("Map instance is not initialized correctly.");
    }
  };

  useEffect(() => {
    const scriptSrc = `https://mapapi.cloud.huawei.com/mapjs/v1/api/js?key=DQEDACk4MlhnmOmdmSVkBNDeJZ6qPhCndg2EUV5ihtAlqHuAbdy5dIY7wfMhlkZZXQc9Z8nFXfWaT3zoZ2pTOsC8soZE8pYPcSOnBQ&callback=initMap`;

    const loadScript = () => {
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
      if (existingScript) {
        (window as any).initMap = initMap;
        return;
      }

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      (window as any).initMap = initMap;

      script.onload = () => {
        initMap();
      };
      script.onerror = () => {
        console.error("Error loading map SDK.");
      };

      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      // Limpieza del mapa
      if (mapInstanceRef.current) {
        window.HWMapJsSDK.event.removeListener(markerRef.current, "dragend", handleMarkerDragEnd);
        mapInstanceRef.current.destroy();
      }
      delete (window as any).initMap;
    };
  }, [formData.latitude, formData.longitude]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare the data for the POST request
    const payload = {
      name: formData.name,
      description: formData.description,
      phone: formData.phone,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      status: formData.status,
      idInstitutionType: formData.idInstitutionType,
      idCounty: formData.idCounty,
    };

    // Send POST request to the server to register the institution
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
        onRegister(); // Call the onRegister function after successful submission
      } else {
        console.error("Failed to register institution");
      }
    } catch (error) {
      console.error("Error during the registration process:", error);
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-gray-800 font-medium">
                Latitude
              </label>
              <input
                id="latitude"
                type="text"
                value={formData.latitude}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                disabled
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-gray-800 font-medium">
                Longitude
              </label>
              <input
                id="longitude"
                type="text"
                value={formData.longitude}
                onChange={handleInputChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
                disabled
              />
            </div>
          </div>
          
          <div ref={mapContainerRef} style={{ height: "300px", marginTop: "20px" }}></div>

          <div>
            <label htmlFor="status" className="block text-gray-800 font-medium">
              Status
            </label>
            <input
              id="status"
              type="number"
              value={formData.status}
              onChange={handleInputChange}
              placeholder="Enter status"
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
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
}*/