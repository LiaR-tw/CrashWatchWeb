import React, { useState, useEffect, useCallback } from "react";
import CheckInstitutions from "./CheckInstitutions";
import { GoogleMap, Marker } from "@react-google-maps/api";
interface RequestAccidentProps {
  accidentId: number;
  onBack: () => void;
}

const RequestAccident: React.FC<RequestAccidentProps> = ({ accidentId, onBack }) => {
  const [accidentData, setAccidentData] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"details" | "institutions">("details");
  const [modalType, setModalType] = useState<"delete" | "finalize" | null>(null);

  const [center, setCenter] = useState({ lat: -17.38333333, lng: -66.16666667 }); // Default center

 
  useEffect(() => {
    // Función para cargar los datos del accidente desde la base de datos
    const fetchAccidentData = async () => {
      try {
        const response = await fetch(`http://localhost:3005/ReportsV/${accidentId}`);
        if (!response.ok) throw new Error("Failed to fetch accident data.");
        const data = await response.json();
        setAccidentData(data);

        // Actualizar las coordenadas en el estado center
        if (data.latitude && data.longitude) {
          setCenter({ lat: data.latitude, lng: data.longitude });
        }
      } catch (err) {
        console.error("Error fetching accident data:", err);
      }
    };

    // Cargar los datos del accidente cada vez que cambia el ID
    fetchAccidentData();
  }, [accidentId]);

  if (!accidentData) {
    return <div>Cargando...</div>;
  }

  const updateStatus = async (newStatus: number) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`http://localhost:3005/ReportsV/${accidentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status.");

      const data = await response.json();
      setAccidentData((prevData: any) => ({ ...prevData, status: data.data.status }));

      // Redirige a la página principal si es eliminar (status 0) o finalizar (status 3)
      if (newStatus === 0 || newStatus === 3) {
        onBack();
      } else {
        alert("El accidente ha sido actualizado.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error al actualizar el estado.");
    } finally {
      setIsUpdating(false);
      setModalOpen(false);
    }
  };

  const openModal = (type: "delete" | "finalize") => {
    setModalType(type);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalType(null);
    setModalOpen(false);
  };

  if (currentView === "institutions") {
    return <CheckInstitutions accidentId={accidentId} />;
  }

  if (!accidentData) {
    return <div className="text-center text-lg font-semibold">Cargando...</div>;
  }


  const isEditable = accidentData.status === 1;
  const isFinalizable = accidentData.status === 2;

  return (  
    <div className="container mx-auto px-6 py-8">
      <button
        onClick={onBack}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Volver
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Detalles del Accidente</h2>
        <p><strong>Descripción:</strong> {accidentData.description}</p>
        <p><strong>Reportado por:</strong> {accidentData.user?.name} {accidentData.user?.lastname}</p>
        <p><strong>Latitud:</strong> {accidentData.latitude}</p>
         <p><strong>Longitud:</strong> {accidentData.longitude}</p>

      <div>
        <h3>Ubicación del Accidente</h3>
        
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "400px" }}
            center={center} // Establecer el centro del mapa con las coordenadas del accidente
            zoom={12}
           
          >
            <Marker position={center} /> {/* Coloca un marcador en las coordenadas obtenidas */}
          </GoogleMap>
          
       
      </div>
        {/* Imágenes */}
        {accidentData.images && accidentData.images.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Imágenes:</h3>
            <div className="grid grid-cols-2 gap-4">
              {accidentData.images.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Imagen ${index + 1}`}
                  className="w-full rounded shadow"
                />
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {accidentData.video && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Video:</h3>
            <video
              className="w-full h-auto rounded shadow"
              controls
              style={{ maxHeight: "300px" }}
            >
              <source src={accidentData.video} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          </div>
        )}

        {/* Audio */}
        {accidentData.audio && (
          <div className="mt-6">
            <h3 className="text-xl font-bold mb-2">Audio:</h3>
            <audio className="w-full rounded shadow" controls>
              <source src={accidentData.audio} type="audio/mpeg" />
              Tu navegador no soporta audio.
            </audio>
          </div>
        )}

        {/* Botones de Confirmar/Eliminar */}
        {isEditable && (
          <div className="flex space-x-4 mt-4">

          <button
            onClick={async () => {
              await updateStatus(2); // Actualiza el estado a 2
              setCurrentView("institutions"); // Cambia la vista a "institutions"
            }}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
            disabled={isUpdating}
          >
            Confirmar
          </button>

         
            <button
              onClick={() => openModal("delete")} // Abre el modal para eliminar
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              disabled={isUpdating}
            >
              Eliminar Accidente
            </button>
          </div>
        )}

        {/* Botón Finalizar */}
        {isFinalizable && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => openModal("finalize")} // Abre el modal para finalizar
              className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
              disabled={isUpdating}
            >
              Finalizar Accidente
            </button>
          </div>
        )}
      </div>

      {/* Modal de Confirmación */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">
              {modalType === "delete"
                ? "¿Seguro que deseas eliminar este accidente?"
                : "¿Seguro que deseas finalizar este accidente?"}
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={() => updateStatus(modalType === "delete" ? 0 : 3)} // Confirmar acción
                className={`${
                  modalType === "delete" ? "bg-red-500" : "bg-purple-500"
                } text-white px-4 py-2 rounded-lg`}
              >
                {modalType === "delete" ? "Eliminar" : "Finalizar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAccident;
