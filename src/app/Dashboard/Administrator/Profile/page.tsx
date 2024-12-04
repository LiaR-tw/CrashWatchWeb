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
  const [users, setUsers] = useState<User[]>([]); // Estado para los usuarios obtenidos desde la API
  const [user, setUser] = useState<User | null>(null); // Estado para el usuario seleccionado

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3005/users12"); // Cambia la URL si es necesario
        if (!response.ok) {
          throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        
        // Suponiendo que el primer usuario es el que debe mostrarse
        setUsers(data);
        setUser(data[0]); // Asignar el primer usuario como el perfil
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Llama a la función para obtener usuarios
  }, []); // La dependencia está vacía para solo ejecutarse una vez

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">User Profile</h1>
      
      {/* Verifica que 'user' no sea null antes de mostrar los datos */}
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
              <p className="text-lg font-semibold text-gray-700">Status:</p>
              <p className="text-xl text-gray-800">{user.status === "1" ? "Active" : "Inactive"}</p>
            </div>
          </div>
        </>
      ) : (
        <p>Loading profile...</p> // Mensaje mientras se cargan los datos
      )}
    </div>
  );
};

export default Profile;
