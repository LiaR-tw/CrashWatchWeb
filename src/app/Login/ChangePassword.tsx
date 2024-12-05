import { useRouter } from "next/navigation";

const ChangePassword: React.FC = () => {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // After password change, redirect to the dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-blue-900 mt-4">
            Change Password
          </h1>
          <p className="text-blue-900 text-sm">
            Please enter your current password and the new one.
          </p>
        </div>
        <form className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-blue-900 font-medium">
              Current Password
            </label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Enter your current password"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-blue-900 font-medium">
              New Password
            </label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter your new password"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-blue-900 font-medium">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your new password"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-900 transition duration-300"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
