"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
          router.replace("/Dashboard"); // Redirige al Dashboard
        } else {
          setIsAuthenticated(false);
          router.replace("/Login"); // Redirige al Login
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
    return <div>Loading...</div>;
  }

  // Este componente nunca debería renderizar nada, ya que siempre redirige
  return null;
}
