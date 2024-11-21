"use client";

import React, { useState } from "react";

type Report = {
  id: number;
  title: string;
  date: string;
  status: "Pending" | "Completed";
};

const reports: Report[] = [
  { id: 1, title: "Annual Report 2024", date: "2024-10-15", status: "Completed" },
  { id: 2, title: "Incident Report", date: "2024-10-20", status: "Pending" },
  { id: 3, title: "Monthly Analysis", date: "2024-11-01", status: "Completed" },
];

const ReportsTable: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  return (
    <div className="mt-6">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Reports</h2>

      <div className="flex gap-6">
        <div className={`w-${selectedReport ? "2/3" : "full"} transition-all`}>
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
              {reports.map((report) => (
                <tr key={report.id} className="border-b hover:bg-gray-50 transition-all duration-200">
                  <td className="py-3 px-6">{report.id}</td>
                  <td className="py-3 px-6">{report.title}</td>
                  <td className="py-3 px-6">{report.date}</td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        report.status === "Completed"
                          ? "bg-green-200 text-green-700"
                          : "bg-yellow-200 text-yellow-800"
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="text-blue-500 hover:underline font-medium"
                      onClick={() => setSelectedReport(report)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedReport && (
          <div className="w-1/3 bg-white p-6 shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold text-[#4F46E5] mb-4">Report Details</h3>
            <p className="mb-2 text-gray-700"><strong>ID:</strong> {selectedReport.id}</p>
            <p className="mb-2 text-gray-700"><strong>Title:</strong> {selectedReport.title}</p>
            <p className="mb-2 text-gray-700"><strong>Date:</strong> {selectedReport.date}</p>
            <p className="mb-4 text-gray-700"><strong>Status:</strong> {selectedReport.status}</p>
            <button
              className="w-full py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6B7AE8] transition-colors duration-300"
              onClick={() => setSelectedReport(null)}
            >
              Close Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTable;
