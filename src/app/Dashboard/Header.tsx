import Image from "next/image";

const Header: React.FC = () => (
  <div className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#6B7AE8] shadow-lg rounded-lg">
    <h1 className="text-3xl font-bold text-white flex-1 text-center">
      Administration Dashboard
    </h1>
    <div className="flex items-center bg-white rounded-full shadow-md px-4 py-2 space-x-2 w-1/3">
      <input
        type="text"
        placeholder="Search"
        className="border-none outline-none text-gray-600 w-full focus:ring-2 focus:ring-indigo-500 rounded-full py-2 px-3"
      />
      <button className="text-white rounded-full p-2 hover:bg-[#6B7AE8] transition-colors duration-300">
      <Image
            src="/Images/Icons/Search.png"
            alt="search"
            width={15}
            height={15}
            className="w-6 h-6"
          />
      </button>
    </div>
  </div>
);

export default Header;
