"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUp() {

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir comportamiento predeterminado del formulario
    router.push("/Login"); // Redirigir al componente Dashboard
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <Image
              src="/default-logo.png" // Cambia esto por la ruta de tu logo
              alt="Logo"
              width={100} // Ajusta el ancho del logo
              height={100} // Ajusta la altura del logo
              className="rounded-full" // Opcional: Da forma redonda al logo
            />
          </div>

          {/* Título y descripción */}
          <h1 className="text-2xl font-bold text-blue-900 mt-4">Crash Watcher - Register</h1>
          <p className="text-blue-900 text-sm">Please fill in the details to register</p>
        </div>

        <form className="space-y-4">
          {/* Name Inputs (First Name and Last Name) */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block text-blue-900 font-medium">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block text-blue-900 font-medium">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-blue-900 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password Inputs */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label htmlFor="password" className="block text-blue-900 font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="confirmPassword" className="block text-blue-900 font-medium">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Latitude and Longitude Inputs */}
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

          {/* Role Select */}
          <div>
            <label htmlFor="role" className="block text-blue-900 font-medium">
              Role
            </label>
            <select
              id="role"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </select>
          </div>

          {/* Register Button */}
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
