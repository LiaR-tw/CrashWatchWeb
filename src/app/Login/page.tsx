"use client";

import { useEffect } from "react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [currentView, setCurrentView] = useState<"login" | "changePassword">(
    "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("http://localhost:3005/user/dashboard", {
          method: "GET",
          credentials: "include", // Incluye las cookies en la petición
        });

        if (response.ok) {
          setIsAuthenticated(true);
          router.replace("/Dashboard");
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
        router.replace("/Login"); // Asegura redirección al Login en caso de error
      }
    };

    checkAuthentication();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("http://localhost:3005/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (response.ok) {
        router.push("/Dashboard");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Login failed");
      }
    } catch (err) {
      console.error("Error in request:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:3005/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      if (response.ok) {
        setCurrentView("login");
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Password change failed");
      }
    } catch (err) {
      console.error("Error in request:", err);
      setError("Something went wrong.");
    }
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

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block text-blue-900 font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-blue-900 font-medium"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  onClick={() => setCurrentView("changePassword")}
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

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
            )}

            <form className="space-y-4" onSubmit={handleSaveNewPassword}>
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
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
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
