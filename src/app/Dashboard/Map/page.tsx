"use client";

import React, { useEffect, useRef, useState } from "react";

const accessToken =
  "DQEDACk4MlhnmOmdmSVkBNDeJZ6qPhCndg2EUV5ihtAlqHuAbdy5dIY7wfMhlkZZXQc9Z8nFXfWaT3zoZ2pTOsC8soZE8pYPcSOnBQ==";

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const initMap = () => {
    if (mapInstanceRef.current || !window.HWMapJsSDK || !mapContainerRef.current) {
      console.log("El mapa ya está inicializado o el SDK no está disponible.");
      return;
    }

    const mapOptions = {
      center: { lat: 48.856613, lng: 2.352222 },
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
    } catch (error) {
      console.error("Error al inicializar el mapa:", error);
      setLoadError("Error al inicializar el mapa.");
    }
  };

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
  }, [accessToken]);

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
          {!isLoaded && <p></p>}
        </div>
      )}
    </div>
  );
};

export default MapView;
