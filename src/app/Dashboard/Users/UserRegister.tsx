"use client";

import React, { useState, useEffect } from "react";

type County = {
  id: string;
  name: string;
};

type Role = {
  id: string;
  name: string;
};

function RegisterForm({ onRegister }: { onRegister: () => void }) {
  const [counties, setCounties] = useState<County[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    lastname: "",
    email: "",
    ci: "",
    phone: "",
    username: "",
    password: "",
    status: "Active",
    latitude: "",
    longitude: "",
    idCounty: "",
    idRol: "",
  });

  // Obtener los países y roles desde la API
  useEffect(() => {
    const fetchCountiesAndRoles = async () => {
      try {
        const countyResponse = await fetch("http://localhost:3005/counties");
        const roleResponse = await fetch("http://localhost:3005/roles");
        
        if (!countyResponse.ok || !roleResponse.ok) {
          throw new Error("Failed to fetch counties or roles.");
        }

        const countiesData = await countyResponse.json();
        const rolesData = await roleResponse.json();

        setCounties(countiesData);
        setRoles(rolesData);
      } catch (error) {
        console.error("Error fetching counties or roles:", error);
      }
    };

    fetchCountiesAndRoles();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Realizar la llamada POST al servidor para registrar al usuario
      const response = await fetch("http://localhost:3005/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Pasamos los datos del formulario
      });

      if (!response.ok) {
        throw new Error("Failed to register user");
      }

      const data = await response.json();
      console.log("User registered:", data);

      onRegister();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-lg w-full border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">User Register</h1>
          <p className="text-gray-600 text-sm mt-2">Fill in the details to register your new User.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-gray-800 font-medium">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="lastname" className="block text-gray-800 font-medium">
              Surname
            </label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              placeholder="Enter User surname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-gray-800 font-medium">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              placeholder="Enter User name"
              value={formData.username}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-gray-800 font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Enter User Email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-800 font-medium">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="number"
                placeholder="Enter User Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="ci" className="block text-gray-800 font-medium">
              CI
            </label>
            <input
              id="ci"
              name="ci"
              type="text"
              placeholder="Enter User CI"
              value={formData.ci}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-800 font-medium">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter User Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="latitude" className="block text-gray-800 font-medium">
                Latitude
              </label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                placeholder="Enter Latitude"
                value={formData.latitude}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
            <div>
              <label htmlFor="longitude" className="block text-gray-800 font-medium">
                Longitude
              </label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                placeholder="Enter Longitude"
                value={formData.longitude}
                onChange={handleChange}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="idCounty" className="block text-gray-800 font-medium">
              Select County
            </label>
            <select
              id="idCounty"
              name="idCounty"
              value={formData.idCounty}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="">Select County</option>
              {counties.map((county) => (
                <option key={county.id} value={county.id}>
                  {county.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="idRol" className="block text-gray-800 font-medium">
              Select Role
            </label>
            <select
              id="idRol"
              name="idRol"
              value={formData.idRol}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm transition-all"
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full mt-6 py-3 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
