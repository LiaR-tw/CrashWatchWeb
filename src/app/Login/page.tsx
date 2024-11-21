"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [currentView, setCurrentView] = useState<"login" | "changePassword">(
    "login"
  );

  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/Dashboard"); // Simula el inicio de sesión o agrega lógica real
  };

  const handleChangePassword = () => {
    setCurrentView("changePassword");
  };

  const handleBackToLogin = () => {
    setCurrentView("login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-white">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="p-4 font-extrabold text-4xl text-black text-center">
          Crash Watcher
        </div>

        {currentView === "login" ? (
          <>
            <div className="text-center mb-6">
              <p className="text-blue-900 text-sm">Please log in to your account</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
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
                <span
                  onClick={handleChangePassword}
                  className="text-blue-500 font-medium hover:underline cursor-pointer"
                >
                  Change password
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <p className="text-blue-900 text-sm">Change your password</p>
            </div>

            <form className="space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-blue-900 font-medium"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-blue-900 font-medium"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="button"
                className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
                onClick={handleBackToLogin}
              >
                Save and Return
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
