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
          const response = await fetch("http://localhost:3005/ReportsAcidentes");
          if (!response.ok) throw new Error("Failed to fetch reports.");
          const data = await response.json();
    
          // Mapear los datos, asegurando que 'status' se capture como un número
          const mappedReports = data.map((report: any) => ({
            id: report.id,
            reporter: `${report.user?.name || "Desconocido"} ${report.user?.lastname || ""}`,
            institution: report.institutions?.[0]?.name || "Sin institución asignada",
            location: `${report.latitude}, ${report.longitude}`,
            time: report.registerDate,
            accidentTypes: report.accidentTypes?.map((type: any) => type.name) || ["Sin tipo"],
            status: typeof report.status === 'number' ? report.status : parseInt(report.status, 10) || 0 // Asegura que el status sea un número
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

  const mapStyles = [
    {
      featureType: "poi",
      elementType: "all",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "landscape",
      elementType: "all",
      stylers: [
        {
          visibility: "on",
        },
      ],
    },
  ];

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
            className="bg-[#5932EA] text-white px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("institutions")}
          >
           View Institutions
          </button>
          <button
            className="bg-orange-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("accidents")}
          >
      
    Accident History
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
            onClick={() => handleButtonClick("ongoingAccidents")}
          >
            View Accidents in Progress
          </button>
    </div>

            <LoadScript googleMapsApiKey="AIzaSyClUE7K-Ytz6duQ6wLYFDNNSJyQSnFFgks">
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "78vh" }}
                center={center}
                zoom={15}
                onClick={handleMapClick}
                options={{
                  styles: mapStyles, // Aplica los estilos personalizados para ocultar los puntos de interés
                }}
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
                    scaledSize: new google.maps.Size(50, 50), // Tamaño pequeño
                  }}
                  onClick={() => handleMarkerClick(institution)}
                />
              );
              })}
           {selectedData === "accidents" && reports.map((accident, index) => {
                // Verifica si el estado del accidente es "1"
                if (accident.status !== 3) {
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
                      fillColor: "orange", 
                      fillOpacity: 0.4,
                      strokeColor: "white",
                      strokeWeight: 2,
                      scale:10,
                    }}
                    onClick={() => alert(`Accidente: ${accident.accidentTypes.join(", ")}, Reportado por: ${accident.reporter}`)}
                  />
                );
              })}

               {/* Mostrar los marcadores de accidentes */}
            {selectedData === "ongoingAccidents" && reports.map((accident, index) => {
                // Verifica si el estado del accidente es "1"
                if (accident.status !== 2) {
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
                      fillOpacity: 0.3,
                      strokeColor: "white",
                      strokeWeight: 2,
                      scale:30,
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
        <p><strong>Description:</strong> {selectedMarker.description}</p>
        <p><strong>Phone:</strong> {selectedMarker.phone}</p>
        <p><strong>Type:</strong> {selectedMarker.type}</p>
        <p><strong>Country:</strong> {selectedMarker.county}</p>
      </div>
    </InfoWindow>
    
        )}
      </GoogleMap>
    </LoadScript>
    </div>
  );
};

export default MapView;
