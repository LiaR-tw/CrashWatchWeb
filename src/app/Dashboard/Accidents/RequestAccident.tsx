import React, { useState } from "react";
import CheckInstitutions from "./CheckInstitutions"; // Asegúrate de importar el componente

interface RequestAccidentProps {
  accidentId: number;
  onBack: () => void; // Función que permite volver hacia atrás
}

const RequestAccident: React.FC<RequestAccidentProps> = ({ accidentId, onBack }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"accept" | "cancel" | "back" | null>(null);
  const [currentView, setCurrentView] = useState<"request" | "checkInstitutions">("request"); // Nuevo estado para la vista actual

  const handleOpenModal = (type: "accept" | "cancel" | "back") => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
  };

  const handleConfirm = () => {
    if (modalType === "accept") {
      setCurrentView("checkInstitutions"); // Cambiar a la vista CheckInstitutions
    } else if (modalType === "cancel") {
      console.log("Navigating back...");
      onBack(); // Usa la función para volver hacia atrás
    } else if (modalType === "back") {
      onBack();
    }
    handleCloseModal();
  };

  if (currentView === "checkInstitutions") {
    return <CheckInstitutions />; // Renderizar CheckInstitutions si la vista actual cambia
  }

  return (
    <div className="p-6 relative">
     <button
      onClick={() => handleOpenModal("back")}
      className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white px-4 py-2 rounded hover:bg-gradient-to-r hover:from-[#6B7AE8] hover:to-[#4F46E5] mb-4"
    >
      Back to accidents
    </button>


      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Accident Details</h2>
        <p className="text-sm text-gray-500 mb-4">
          Viewing details for accident ID: {accidentId + 1}
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => handleOpenModal("accept")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Accept
          </button>
          <button
            onClick={() => handleOpenModal("cancel")}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">
              {modalType === "accept" && "Do you want to accept this accident?"}
              {modalType === "cancel" && "Do you want to delete this accident?"}
              {modalType === "back" && "Do you want to go back?"}
            </h3>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-300 text-black px-4 py-2 rounded"
              >
                No
              </button>
              <button
                onClick={handleConfirm}
                className={`${
                  modalType === "cancel" ? "bg-red-500" : "bg-green-500"
                } text-white px-4 py-2 rounded`}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAccident;
