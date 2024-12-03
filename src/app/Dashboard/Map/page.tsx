import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";

type Institution = {
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  phone: string;
  type: string;
  county: string;
};
type Accident = {
  id: number;
  reporter: string;
  institution: string | null;
  location: string;
  time: string;
  accidentTypes: string[];
  status:number;
};



const MapView: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [center, setCenter] = useState({ lat: -17.38333333, lng: -66.16666667 });
  const [selectedMarker, setSelectedMarker] = useState<Institution | null>(null);


  const [selectedData, setSelectedData] = useState<"institutions" | "accidents" | "ongoingAccidents">("institutions");

  const [reports, setReports] = useState<Accident[]>([]);

  const [error, setError] = useState<string | null>(null);

  // Callback para manejar el clic en el mapa
  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat() || 0;
    const lng = e.latLng?.lng() || 0;
    setCenter({ lat, lng });
  }, []);

  // Función para obtener las instituciones
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const institutionsResponse = await fetch("http://localhost:3005/institutionsTypeG");
      if (!institutionsResponse.ok) throw new Error("Failed to fetch institutions.");
      const institutionsData = await institutionsResponse.json();
      if (Array.isArray(institutionsData)) {
        setInstitutions(institutionsData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching institutions:", error);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);//eso es para institucion
  //es para acidentes
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:3005/ReportsAcidentes"); // Cambia la URL según corresponda
        if (!response.ok) throw new Error("Failed to fetch reports.");
        const data = await response.json();

        // Mapear los datos para mostrar solo la información requerida
        const mappedReports = data.map((report: any) => ({
          id: report.id,
          reporter: `${report.user?.name || "Desconocido"} ${report.user?.lastname || ""}`,
          institution: report.institutions?.[0]?.name || "Sin institución asignada",
          location: `${report.latitude}, ${report.longitude}`,
          time: report.registerDate,
          accidentTypes: report.accidentTypes?.map((type: any) => type.name) || ["Sin tipo"],
        }));

        setReports(mappedReports);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError("Error al cargar los reportes.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);



  // Función para obtener la URL del ícono en función del tipo de institución
  const getIconUrl = (type: string) => {
    switch (type) {
      case "Hospital":
        return "/Images/Icons/Hospital.png";
      case "Fire Fighters":
        return "/Images/Icons/Firefighter.png";
      case "Transit":
        return "/Images/Icons/Transit.png";
      case "Police":
        return "/Images/Icons/Police.png";
      default:
        return "/Images/Icons/Default.png";
    }
  };

  // Manejar el clic en un marcador para seleccionar el marcador y mostrar la InfoWindow
  const handleMarkerClick = (institution: Institution) => {
    setSelectedMarker(institution);
  };
  const handleButtonClick = (dataType: "institutions" | "accidents" | "ongoingAccidents") => {
    setSelectedData(dataType);
    setSelectedMarker(null); // Resetea el marcador seleccionado
  };


  
  return (
    <div className="relative">

    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
            <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("institutions")}
          >
            Ver Instituciones
          </button>
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("accidents")}
          >
            Ver Accidentes
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("ongoingAccidents")}
          >
            Ver Accidentes en Curso
          </button>
    </div>

            <LoadScript googleMapsApiKey="AIzaSyClUE7K-Ytz6duQ6wLYFDNNSJyQSnFFgks">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100vh" }}
                center={center}
                zoom={15}
                onClick={handleMapClick}
              >
             {/* Marcadores */}
             {selectedData === "institutions" && institutions.map((institution, index) => {
            const iconUrl = getIconUrl(institution.type);
            return (
                <Marker
                  key={index}
                  position={{ lat: institution.latitude, lng: institution.longitude }}
                  icon={{
                    url: iconUrl,
                    scaledSize: new google.maps.Size(70, 70), // Tamaño pequeño
                  }}
                  onClick={() => handleMarkerClick(institution)}
                />
              );
              })}
              {/* Mostrar los marcadores de accidentes */}
              {selectedData === "accidents" && reports.map((accident, index) => {
                const [latitude, longitude] = accident.location.split(",").map(parseFloat);

                if (isNaN(latitude) || isNaN(longitude)) {
                  console.warn(`Invalid coordinates for accident at index ${index}: ${latitude}, ${longitude}`);
                  return null; // No crear el marcador si las coordenadas son inválidas
                }

                return (
                  <Marker
                    key={accident.id}
                    position={{ lat: latitude, lng: longitude }}
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: "red",
                      fillOpacity: 0.8,
                      strokeColor: "white",
                      strokeWeight: 2,
                      scale: 6,
                    }}
                    onClick={() => alert(`Accidente: ${accident.accidentTypes.join(", ")}, Reportado por: ${accident.reporter}`)}
                  />
                );
              })}
               {/* Mostrar los marcadores de accidentes */}
            {selectedData === "ongoingAccidents" && reports.map((accident, index) => {
                // Verifica si el estado del accidente es "1"
                if (accident.status !== 1) {
                  return null; // Si el estado no es "1", no creas el marcador
                }

                // Divide la ubicación para obtener latitud y longitud
                const [latitude, longitude] = accident.location.split(",").map(parseFloat);

                // Verificar si las coordenadas son válidas
                if (isNaN(latitude) || isNaN(longitude)) {
                  console.warn(`Invalid coordinates for accident at index ${index}: ${latitude}, ${longitude}`);
                  return null; // No crear el marcador si las coordenadas son inválidas
                }

                return (
                  <Marker
                    key={accident.id}
                    position={{ lat: latitude, lng: longitude }} // Usar las coordenadas del accidente
                    icon={{
                      path: google.maps.SymbolPath.CIRCLE,
                      fillColor: "red", 
                      fillOpacity: 0.8,
                      strokeColor: "white",
                      strokeWeight: 2,
                      scale: 6,
                    }}
                    onClick={() => alert(`Accidente: ${accident.accidentTypes.join(", ")}, Reportado por: ${accident.reporter}`)}
                  />
                );
              })}

        {/*      */}
        {selectedMarker && (
      <InfoWindow
      position={{
        lat: selectedMarker.latitude,
        lng: selectedMarker.longitude,
      }}
      onCloseClick={() => setSelectedMarker(null)}
    >
      <div className="bg-[#5932EA] text-white p-4 rounded-lg shadow-lg w-60">
        <h3 className="text-lg font-semibold">{selectedMarker.name}</h3>
        <p><strong>Descripción:</strong> {selectedMarker.description}</p>
        <p><strong>Teléfono:</strong> {selectedMarker.phone}</p>
        <p><strong>Tipo:</strong> {selectedMarker.type}</p>
        <p><strong>Condado:</strong> {selectedMarker.county}</p>
      </div>
    </InfoWindow>
    
        )}
      </GoogleMap>
    </LoadScript>

          <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Lista de Accidentes</h2>
          <ul className="list-none space-y-2 mt-2">
            {reports.map((report) => (
              <li key={report.id} className="p-2 bg-white rounded-lg shadow hover:bg-gray-200">
                <p><strong>Reportado por:</strong> {report.reporter}</p>
                <p><strong>Institución:</strong> {report.institution}</p>
                <p><strong>ubcacion:</strong> {report.location}</p>

                <p><strong>Fecha:</strong> {report.time}</p>
                <p><strong>Tipos de Accidente:</strong> {report.accidentTypes.join(', ')}</p>
              </li>
            ))}
          </ul>
        </div>
        </div>
  );
};

export default MapView;
