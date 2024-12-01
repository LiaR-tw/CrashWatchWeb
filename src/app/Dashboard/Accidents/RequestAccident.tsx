import React, { useState, useEffect } from "react";
import CheckInstitutions from "./CheckInstitutions";

interface RequestAccidentProps {
  accidentId: number;
  onBack: () => void;
}

const RequestAccident: React.FC<RequestAccidentProps> = ({ accidentId, onBack }) => {
  const [accidentData, setAccidentData] = useState<any>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"accept" | "cancel" | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"details" | "institutions">("details");

  useEffect(() => {
    const fetchAccidentData = async () => {
      try {
        const response = await fetch(`http://localhost:3005/ReportsV/${accidentId}`);
        if (!response.ok) throw new Error("Failed to fetch accident data.");
        const data = await response.json();
        setAccidentData(data);
      } catch (err) {
        console.error("Error fetching accident data:", err);
      }
    };

    fetchAccidentData();
  }, [accidentId]);

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

      if (newStatus === 2) {
        setCurrentView("institutions"); // Cambiamos la vista a "institutions" cuando se confirma el accidente
      } else {
        alert("El accidente ha sido cancelado.");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error al actualizar el estado.");
    } finally {
      setIsUpdating(false);
      setModalOpen(false);
    }
  };

  const handleOpenModal = (type: "accept" | "cancel") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  if (currentView === "institutions") {
    return <CheckInstitutions accidentId={accidentId} />;
  }

  if (!accidentData) {
    return <div className="text-center text-lg font-semibold">Cargando...</div>;
  }

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
            <audio
              className="w-full rounded shadow"
              controls
            >
              <source src={accidentData.audio} type="audio/mpeg" />
              Tu navegador no soporta audio.
            </audio>
          </div>
        )}

        <div className="flex space-x-4 mt-4">
          <button
            onClick={() => handleOpenModal("accept")}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
            disabled={isUpdating}
          >
            Confirmar
          </button>
          <button
            onClick={() => handleOpenModal("cancel")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
            disabled={isUpdating}
          >
            Cancelar
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">
              {modalType === "accept" && "¿Deseas confirmar esta solicitud?"}
              {modalType === "cancel" && "¿Deseas cancelar esta solicitud?"}
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded-lg"
              >
                No
              </button>
              <button
                onClick={() => updateStatus(modalType === "accept" ? 2 : 0)}
                className={`${
                  modalType === "accept" ? "bg-green-500" : "bg-red-500"
                } text-white px-4 py-2 rounded-lg`}
              >
                Sí
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAccident;
