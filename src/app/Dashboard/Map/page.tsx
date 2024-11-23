import React, { useEffect, useRef, useState } from 'react';

interface HuaweiMapProps {
  accessToken: string;
}

const MapView: React.FC<HuaweiMapProps> = ({ accessToken }) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null); // Referencia para la instancia del mapa
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const initMap = () => {
    if (mapContainerRef.current && window.HWMapJsSDK) {
      // Si ya existe una instancia previa del mapa, la limpiamos
      if (mapInstanceRef.current) {
        console.log('Eliminando instancia previa del mapa.');
        mapInstanceRef.current = null;
      }

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
      console.log('El SDK ya está cargado, inicializando el mapa...');
      setIsLoaded(true);
      initMap();
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
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'start', height: '100vh', width: '100%' }}>
      {loadError ? (
        <p style={{ color: 'red' }}>{loadError}</p>
      ) : (
        <div
          ref={mapContainerRef}
          style={{
            height: '75%',
            width: '90%',
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
