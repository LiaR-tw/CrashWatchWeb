"use client";

import React from "react";

const MapView: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Hello Admin 👋</h2>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <img
                src="/path/to/avatar.png"
                alt="Avatar"
                className="w-8 h-8 rounded-full mr-3"
              />
              <div>
                <p className="font-bold">Joseph</p>
                <p className="text-sm text-gray-500">Cercado, Cochabamba</p>
              </div>
            </div>
            <img
              src="/path/to/image.png"
              alt="Accident"
              className="rounded-lg mb-4"
            />
            <p className="text-sm text-gray-500 mb-4">
              Lorem ipsum dolor sit amet consectetur. Nibh ornare auctor eu
              ligula tellus...
            </p>
            <button className="text-blue-500 text-sm font-semibold">
              Read more...
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;