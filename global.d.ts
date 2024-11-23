declare namespace H {
    namespace map {
      class Map {
        constructor(
          element: HTMLElement,
          options: { center: { lat: number; lng: number }; zoom: number; language: string }
        );
        addObject(object: any): void;
      }
  
      class Marker {
        constructor(options: { position: { lat: number; lng: number } });
      }
    }
  }
  
  // Declarar H como propiedad global del objeto window
  interface Window {
    H: typeof H;
  }
  declare global {
    interface Window {
      HWMapJsSDK: any; // O usa el tipo específico si lo conoces
    }
  }
  
  export {};
  