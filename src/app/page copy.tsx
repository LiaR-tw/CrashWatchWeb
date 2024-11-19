// app/page.tsx
import Image from "next/image";
import Link from "next/link";  // Asegúrate de importar el componente Link

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-6">
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
      <div className="text-center mb-6">
        <Image
          src="/next.svg"
          alt="Next.js Logo"
          width={120}
          height={30}
          priority
        />
        <h1 className="text-2xl font-bold text-gray-800 mt-4">Welcome Back!</h1>
        <p className="text-gray-500 text-sm">Please log in to your account</p>
      </div>

      <form className="space-y-4">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="block text-gray-700 font-medium">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition duration-300"
        >
          Log In
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a
            href="#"
            className="text-purple-500 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  </div>
  );
}
