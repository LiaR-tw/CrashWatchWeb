"use client";

import React, { useState } from "react";
import AccidentsView from "./page";

type Institution = {
  name: string;
  type: string;
  phone: string;
  email: string;
  city: string;
  status: "Active" | "Inactive";
};

const institutions: Institution[] = [
  { name: "Univalle", type: "Hospital", phone: "+591 95566117", email: "univalle231@gmail.com", city: "Cochabamba", status: "Active" },
  { name: "Viedman", type: "Hospital", phone: "+591 95566117", email: "viedma885@yahoo.com", city: "Cochabamba", status: "Inactive" },
  { name: "Transit", type: "Police", phone: "+591 8723952", email: "ronald@adobe.com", city: "Cochabamba", status: "Inactive" },
  { name: "Comand", type: "Police", phone: "+591 7832159", email: "marvin@tesla.com", city: "Cochabamba", status: "Active" },
  { name: "Sar", type: "Firefighters", phone: "+10 97881541", email: "jerome@google.com", city: "Santa Cruz", status: "Active" },
];

const CheckInstitutions: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>("table");
  const [selectedInstitutions, setSelectedInstitutions] = useState<Record<number, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);

  const handleCheckboxChange = (index: number) => {
    setSelectedInstitutions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openModal = (type: "send" | "cancel") => {
    const selectedCount = Object.values(selectedInstitutions).filter(Boolean).length;

    if (type === "send") {
      setModalContent(
        <div>
          <h3 className="text-xl font-semibold">Confirm Send</h3>
          <p className="mt-2">
            You have selected <strong>{selectedCount}</strong> institution(s). Are you sure you want to send them?
          </p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setCurrentView("accidents");
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Confirm
            </button>
          </div>
        </div>
      );
    } else if (type === "cancel") {
      setModalContent(
        <div>
          <h3 className="text-xl font-semibold">Confirm Cancel</h3>
          <p className="mt-2">Are you sure you want to cancel and exit?</p>
          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
            >
              No
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                setCurrentView("accidents");
              }}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Yes, Exit
            </button>
          </div>
        </div>
      );
    }

    setIsModalOpen(true);
  };

  const renderContent = () => {
    if (currentView === "table") {
      return (
        <div>
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">All Institutions</h2>
          <div className="flex justify-between items-center mb-6">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-4 py-2 w-1/3 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
            </select>
          </div>
          <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">Select</th>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Type</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">City</th>
                <th className="py-3 px-6 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {institutions.map((institution, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="py-3 px-6">
                    <input
                      type="checkbox"
                      checked={!!selectedInstitutions[index]}
                      onChange={() => handleCheckboxChange(index)}
                      className="form-checkbox h-5 w-5 text-indigo-600"
                    />
                  </td>
                  <td className="py-3 px-6">{institution.name}</td>
                  <td className="py-3 px-6">{institution.type}</td>
                  <td className="py-3 px-6">{institution.phone}</td>
                  <td className="py-3 px-6">{institution.email}</td>
                  <td className="py-3 px-6">{institution.city}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        institution.status === "Active" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                      }`}
                    >
                      {institution.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6 text-center flex justify-center gap-4">
            <button
              onClick={() => openModal("cancel")}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Cancel
            </button>
            <button
              onClick={() => openModal("send")}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-300"
            >
              Send
            </button>
          </div>
        </div>
      );
    } else if (currentView === "accidents") {
      return <AccidentsView />;
    }
  };

  return (
    <div className="px-8 py-6">
      {renderContent()}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">{modalContent}</div>
        </div>
      )}
    </div>
  );
};

export default CheckInstitutions;
