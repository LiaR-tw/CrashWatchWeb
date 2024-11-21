"use client";

import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); 
    router.push("/Dashboard");
  }

   const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault(); 
    router.push("/ChangePassword");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br bg-white">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="p-4 font-extrabold text-4xl text-black text-center">
          Crash Watcher
        </div>

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
            onClick={handleLogin}
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
