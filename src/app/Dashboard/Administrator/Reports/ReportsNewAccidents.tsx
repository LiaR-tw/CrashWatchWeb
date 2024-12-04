"use client";

import React, { useState } from "react";

type NewAccident = {
  id: number;
  title: string;
  date: string;
  status: "Pending" | "Resolved";
};

const newAccidents: NewAccident[] = [
  { id: 1, title: "Minor Collision", date: "2024-11-05", status: "Pending" },
  { id: 2, title: "Vehicle Breakdown", date: "2024-11-06", status: "Resolved" },
  { id: 3, title: "Road Obstruction", date: "2024-11-07", status: "Pending" },
];

const ReportsNewAccidents: React.FC = () => {
  const [selectedAccident, setSelectedAccident] = useState<NewAccident | null>(null);

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">New Accidents</h2>

      <div className="flex gap-6">
        <div className={`w-${selectedAccident ? "2/3" : "full"} transition-all`}>
          <table className="min-w-full bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
            <thead className="bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] text-white">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Title</th>
                <th className="py-3 px-6 text-left">Date</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {newAccidents.map((accident) => (
                <tr key={accident.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="py-3 px-6">{accident.id}</td>
                  <td className="py-3 px-6">{accident.title}</td>
                  <td className="py-3 px-6">{accident.date}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        accident.status === "Resolved"
                          ? "bg-green-200 text-green-700"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {accident.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="text-blue-500 hover:underline font-medium"
                      onClick={() => setSelectedAccident(accident)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedAccident && (
          <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#4F46E5] mb-4">Accident Details</h3>
            <p className="mb-2 text-gray-700"><strong>ID:</strong> {selectedAccident.id}</p>
            <p className="mb-2 text-gray-700"><strong>Title:</strong> {selectedAccident.title}</p>
            <p className="mb-2 text-gray-700"><strong>Date:</strong> {selectedAccident.date}</p>
            <p className="mb-4 text-gray-700"><strong>Status:</strong> {selectedAccident.status}</p>
            <button
              className="w-full py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6B7AE8] transition-colors duration-300"
              onClick={() => setSelectedAccident(null)}
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsNewAccidents;
