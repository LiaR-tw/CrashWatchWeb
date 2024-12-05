"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode  from "jwt-decode";

export default function Login() {
  const [token, setToken] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<"login" | "changePassword">("login");
  const [email, setEmail] = useState("");
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  // Efecto para verificar autenticación
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");

    // Si ya existe un token, redirigir a la página correspondiente según el rol
    if (storedToken) {
      const decodedToken: any = jwtDecode(storedToken);
      const userRole = decodedToken?.rol;

      // Redirigir dependiendo del rol
      if (userRole === "Ciudadano") {
        router.replace("/NoAccess");
      } else if (userRole === "Institucional") {
        router.replace("/Dashboard/Institutionalist");
      } else if (userRole === "Administrativo") {
        router.replace("/Dashboard/Administrator");
      }
    }
  }, [router]);
  // Manejar login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`http://localhost:3005/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        const receivedToken = data.token;
        

        if (receivedToken) {
          localStorage.setItem("authToken", receivedToken); // Guardar en localStorage

          setToken(receivedToken); // Almacenar token en el estado
          const decodedToken = jwtDecode<{ rol: string }>(receivedToken);
          console.log(decodedToken);
          // Redirigir según el rol (opcional, puedes manejarlo después)
          if (decodedToken.rol == "Ciudadano") {
            router.replace("/NoAccess");
          } else if (decodedToken.rol == "Institucional") {
            router.replace("/Dashboard/Institutionalist");
          } else if (decodedToken.rol == "Administrativo") {
            router.replace("/Dashboard/Administrator");
          } else {
            setError("Role not recognized.");
          }
        } else {
          setError("No token found");
        }
      } else {
        setError(data.message || "Login failed");
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
      const response = await fetch(`http://localhost:3005/change-password`, {
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
      console.error("Error en la solicitud:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-white">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="p-4 font-extrabold text-4xl text-black text-center">Crash Watcher</div>

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
                <label htmlFor="email" className="block text-blue-900 font-medium">Email</label>
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
                <label htmlFor="password" className="block text-blue-900 font-medium">Password</label>
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
                <label htmlFor="newPassword" className="block text-blue-900 font-medium">New Password</label>
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
                <label htmlFor="confirmPassword" className="block text-blue-900 font-medium">Confirm Password</label>
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
                Save New Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
