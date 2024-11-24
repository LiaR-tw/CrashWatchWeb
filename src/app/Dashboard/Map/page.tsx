import React, { useEffect, useRef, useState } from 'react';

const accessToken = 'DQEDACk4MlhnmOmdmSVkBNDeJZ6qPhCndg2EUV5ihtAlqHuAbdy5dIY7wfMhlkZZXQc9Z8nFXfWaT3zoZ2pTOsC8soZE8pYPcSOnBQ==';

const MapView: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null); // Referencia para la instancia del mapa
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const initMap = () => {
    // Verificar si ya hay una instancia del mapa
    if (mapInstanceRef.current) {
      console.log('El mapa ya está inicializado, evitando reinicialización.');
      return;
    }

    if (mapContainerRef.current && window.HWMapJsSDK) {
      const mapOptions = {
        center: { lat: 48.856613, lng: 2.352222 }, // París
        zoom: 8,
        language: 'ENG',
        sourceType: 'raster',
        authOptions: { accessToken },
      };

      try {
        // Crear y guardar una nueva instancia del mapa
        mapInstanceRef.current = new window.HWMapJsSDK.HWMap(mapContainerRef.current, mapOptions);
        console.log('Mapa inicializado correctamente.');
      } catch (error) {
        console.error('Error al inicializar el mapa:', error);
        setLoadError('Error al inicializar el mapa.');
      }
    } else {
      setLoadError('SDK no está disponible.');
    }
  };

  useEffect(() => {
    const scriptSrc = `https://mapapi.cloud.huawei.com/mapjs/v1/api/js?key=${accessToken}&callback=initMap`;

    // Verificar si el script ya está cargado
    const existingScript = document.querySelector(`script[src="${scriptSrc}"]`);
    if (existingScript) {
      console.log('El SDK ya está cargado, verificando el mapa...');
      setIsLoaded(true);
      initMap(); // Llama a `initMap` solo si no se ha inicializado antes
      return;
    }

    // Cargar el script si no está presente
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;

    (window as any).initMap = () => {
      setIsLoaded(true);
      initMap();
    };

    script.onload = () => console.log('Script cargado correctamente.');
    script.onerror = () => {
      console.error('Error al cargar el SDK de Huawei Maps');
      setLoadError('Error al cargar el SDK de Huawei Maps.');
    };

    document.head.appendChild(script);

    // Limpieza al desmontar
    return () => {
      delete (window as any).initMap;

      // Limpieza de la referencia del mapa
      if (mapInstanceRef.current) {
        console.log('Eliminando instancia del mapa en desmontaje.');
        mapInstanceRef.current = null;
      }
    };
  }, [accessToken]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '75vh', width: '100%' }}>
      {loadError ? (
        <p style={{ color: 'red' }}>{loadError}</p>
      ) : (
        <div
          ref={mapContainerRef}
          style={{
            height: '100%',
            width: '100%',
            border: '1px solid #ccc',
          }}
        >
          {!isLoaded && <p>Cargando mapa...</p>}
        </div>
      )}
    </div>
  );
};

export default MapView;
