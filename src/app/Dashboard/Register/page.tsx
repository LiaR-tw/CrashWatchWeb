"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Register() {

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    router.push("/Login");
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/default-logo.png" 
              alt="Logo"
              width={100}
              height={100} 
              className="rounded-full"
            />
          </div>

          <h1 className="text-2xl font-bold text-blue-900 mt-4">Institutional Register</h1>
          <p className="text-blue-900 text-sm">Please fill in the details to register</p>
        </div>

        <form className="space-y-4">
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-blue-900 font-medium">
              Institutional Name
              </label>
              <input
                id=" InstitutionalName"
                type="text"
                placeholder="Enter your first name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-blue-900 font-medium">
                Location
              </label>
              <input
                id="Location"
                type="text"
                placeholder="Enter your last name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="latitude" className="block text-blue-900 font-medium">
                Latitude
              </label>
              <input
                id="latitude"
                type="text"
                placeholder="Enter the latitude"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="longitude" className="block text-blue-900 font-medium">
                Longitude
              </label>
              <input
                id="longitude"
                type="text"
                placeholder="Enter the longitude"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label htmlFor="role" className="block text-blue-900 font-medium">
              Category
            </label>
            <select
              id="role"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Salud">Salud</option>
              <option value="Police">Police</option>
              <option value="Bomberos">Bomberos</option>
            </select>
          </div>

          <button
            onClick={handleLogin}
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-blue-900">
            Already have an account?{" "}
            <a
              onClick={handleLogin}
              className="text-blue-500 font-medium hover:underline"
            >
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
