import { useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  lastname: string;
  email: string;
  ci: string;
  phone: string;
  username: string;
  rol: string;
  institution: string;
  status: string;
};

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null); // Estado para almacenar el perfil del usuario
  const [loading, setLoading] = useState<boolean>(true); // Indicador de carga
  const [error, setError] = useState<string | null>(null); // Manejo de errores

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch("http://localhost:3005/users/me", {
          credentials: "include", // Permite enviar cookies con la solicitud
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUser(data.user); // Asigna el perfil recibido desde el servidor
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Detener indicador de carga
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
        User Profile
      </h1>

      {user ? (
        <>
          <div className="flex justify-center items-center space-x-4 mb-6">
            <img
              src="/images/Icons/Avatar.png"
              alt="Profile Picture"
              className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg"
            />
            <label htmlFor="file-input" className="text-blue-600 font-medium cursor-pointer hover:underline">
              Change Photo
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              className="hidden"
            />
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-lg font-semibold text-gray-700">Name:</p>
              <p className="text-xl text-gray-800">{user.name} {user.lastname}</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700">Email:</p>
              <p className="text-xl text-gray-800">{user.email}</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700">Phone:</p>
              <p className="text-xl text-gray-800">{user.phone}</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700">Username:</p>
              <p className="text-xl text-gray-800">{user.username}</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700">Role:</p>
              <p className="text-xl text-gray-800">{user.rol}</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700">institution:</p>
              <p className="text-xl text-gray-800">{user.institution}</p>
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-700">Status:</p>
              <p className="text-xl text-gray-800">{user.status === "1" ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </>
      ) : (
        <p>User profile not found.</p>
      )}
    </div>
  );
};

export default Profile;
