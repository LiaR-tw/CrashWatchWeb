
//****
import React, { useEffect, useRef, useState } from "react";

type Institution = {
  name: string;
  phone: number;
  address: string;
  latitude: number;
  longitude: number;
  status: number;
  type: string;
  county: string;
};

const accessToken = "DQEDACk4MlhnmOmdmSVkBNDeJZ6qPhCndg2EUV5ihtAlqHuAbdy5dIY7wfMhlkZZXQc9Z8nFXfWaT3zoZ2pTOsC8soZE8pYPcSOnBQ==";

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [types, setTypes] = useState<string[]>([]);

  const initMap = () => {
    if (mapInstanceRef.current || !window.HWMapJsSDK || !mapContainerRef.current) {
      console.log("El mapa ya está inicializado o el SDK no está disponible.");
      return;
    }

    const mapOptions = {
      center: { lat: -17.38333333, lng: -66.16666667 },
      zoom: 8,
      language: "ENG",
      sourceType: "raster",
      authOptions: { accessToken },
    };

    try {
      mapInstanceRef.current = new window.HWMapJsSDK.HWMap(
        mapContainerRef.current,
        mapOptions
      );
      console.log("Mapa inicializado correctamente.");

      // Ahora que el mapa está listo, añadimos los marcadores
      addMarkers();
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      setLoadError("Error al inicializar el mapa.");
    }
  };

  const addMarkers = () => {
    institutions.forEach((institution) => {
      if (
        institution.latitude &&
        institution.longitude &&
        institution.status === 1
      ) {
        console.log(
          `Marcador para ${institution.name} en lat: ${institution.latitude}, lng: ${institution.longitude}`
        );

        // Crear un marcador para cada institución
        new window.HWMapJsSDK.HWMarker({
          map: mapInstanceRef.current,
          position: { lat: institution.latitude, lng: institution.longitude },
          zIndex: 10,
          label: {
            text: `${institution.name} (${institution.type})`,
            offsetY: -40,
            fontSize: "14px",
          },
          icon: {
            scale: 0.5,
            url: "/Images/Icons/Hospital.png", // Asegúrate de que la ruta del icono sea correcta
          },
          infoWindow: {
            content: `<h4>${institution.name}</h4><p>Type: ${institution.type}</p><p>Address: ${institution.address}</p>`,
          },
        });
      } else {
        console.error(`Coordenadas no válidas o institución inactiva para ${institution.name}`);
      }
    });
  };

  const fetchData = async () => {
    setIsLoading(true);
    setLoadError(null); // Resetear el error en cada intento de carga.

    try {
      // Obtener instituciones
      const institutionsResponse = await fetch("http://localhost:3005/institutions");
      if (!institutionsResponse.ok) throw new Error("Failed to fetch institutions.");
      const institutionsData = await institutionsResponse.json();
      setInstitutions(Array.isArray(institutionsData) ? institutionsData : []);

      // Obtener tipos de institución
      const typesResponse = await fetch("http://localhost:3005/institutionTypesAvailable");
      if (!typesResponse.ok) throw new Error("Failed to fetch institution types.");
      const typesData = await typesResponse.json();
      if (Array.isArray(typesData)) {
        const typeNames = typesData.map((type: { name: string }) => type.name);
        setTypes(typeNames);
      } else {
        console.error("Datos inesperados:", typesData);
      }

      setLoadError(null);
    } catch (err) {
      console.error(err);
      setLoadError("Error al cargar los datos.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect para cargar el SDK de Huawei Maps
  useEffect(() => {
    const scriptSrc = `https://mapapi.cloud.huawei.com/mapjs/v1/api/js?key=${accessToken}&callback=initMap`;

    const loadScript = () => {
      const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
      if (existingScript) {
        console.log("El SDK ya está cargado, inicializando el mapa...");
        (window as any).initMap = initMap; // Callback para el SDK
        if (isLoaded) {
          initMap();
        }
        return;
      }

      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;

      (window as any).initMap = () => {
        setIsLoaded(true);
        initMap();
      };

      script.onload = () => console.log("Script cargado correctamente.");
      script.onerror = () => setLoadError("Error al cargar el SDK de Huawei Maps.");

      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      if (mapInstanceRef.current) {
        console.log("Desmontando mapa y limpiando instancia.");
        mapInstanceRef.current.destroy?.(); // Método destroy si está disponible
        mapInstanceRef.current = null;
      }

      delete (window as any).initMap;
    };
  }, []); // Elimina las dependencias cambiantes

  // useEffect para cargar las instituciones y tipos
  useEffect(() => {
    fetchData();
  }, []); // Este useEffect solo se ejecuta una vez al cargar el componente

  return (
    <div style={{ display: "flex", justifyContent: "center", height: "75vh", width: "100%" }}>
      {loadError ? (
        <p style={{ color: "red" }}>{loadError}</p>
      ) : (
        <div
          ref={mapContainerRef}
          style={{
            height: "100%",
            width: "100%",
            border: "1px solid #ccc",
          }}
        >
          {isLoading && <p>Cargando...</p>}
        </div>
      )}

      {/* Listado de Instituciones y Tipos */}
      <div style={{ marginTop: "20px" }}>
        <h3>Instituciones Cargadas:</h3>
        <ul>
          {institutions.length > 0 ? (
            institutions.map((institution, index) => (
              <li key={index}>
                <strong>{institution.name}</strong><br />
                Dirección: {institution.address}<br />
                Teléfono: {institution.phone}<br />
                Tipo: {institution.type}<br />
                Estado: {institution.status === 1 ? "Activo" : "Inactivo"}<br />
                Coordenadas: ({institution.latitude}, {institution.longitude})<br />
                Condado: {institution.county}
              </li>
            ))
          ) : (
            <li>No se han cargado instituciones.</li>
          )}
        </ul>

        <h3>Tipos de Instituciones:</h3>
        <ul>
          {types.length > 0 ? (
            types.map((type, index) => (
              <li key={index}>{type}</li>
            ))
          ) : (
            <li>No se han cargado tipos de instituciones.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MapView;

