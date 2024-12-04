"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode"; // Asegúrate de tener esta dependencia instalada

export default function Home() {
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
          // Obtener el token desde las cookies
          const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("authToken="))
            ?.split("=")[1];

          if (token) {
            // Decodificar el token
            const decodedToken = jwtDecode<{ role: string }>(token);
            
            // Redirigir según el rol
            if (decodedToken.role === "institucionalista") {
              router.replace("/Dashboard/Institucionalist");
            } else if (decodedToken.role === "ciudadano") {
              router.replace("/NoAccess");
            } else {
              router.replace("/Dashboard/Administrator");
            }
          }
        } else {
          setIsAuthenticated(false);
          router.replace("/Login"); // Redirige al Login si no está autenticado
        }
      } catch (error) {
        console.error("Error verificando autenticación:", error);
        setIsAuthenticated(false);
        router.replace("/Login"); // Asegura redirección al Login en caso de error
      }
    };

    checkAuthentication();
  }, [router]);

  // Mostrar estado de carga mientras verifica autenticación
  if (isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  // Este componente nunca debería renderizar nada, ya que siempre redirige
  return null;
}
