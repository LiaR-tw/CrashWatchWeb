"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    router.push("/Dashboard"); // Redirigir al componente Dashboard
  }

   const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault(); 
    router.push("/ChangePassword"); // Redirigir al componente Dashboard
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png" // Reemplaza con la ruta a tu logo
            alt="Logo"
            width={100} // Ancho del logo
            height={100} // Altura del logo
            className="rounded-full" // Clase para redondear el logo (opcional)
          />
        </div>

        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mt-4">Crash Watcher</h1>
          <p className="text-blue-900 text-sm">Please log in to your account</p>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
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
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-blue-900 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
          >
            Log In
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-blue-900">
            Forgot your password?{" "}
            <a
              onClick={handleChangePassword}
              className="text-blue-500 font-medium hover:underline"
            >
              Change password
            </a>
          </p>
        </div>

       
      </div>
    </div>
  );
}
