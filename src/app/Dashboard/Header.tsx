const Header: React.FC = () => (
    <div className="flex justify-between items-center px-8 py-4 bg-white shadow-md">
      <h1 className="text-2xl font-bold">Hello Admin 👋</h1>
      <input
        type="text"
        placeholder="Search"
        className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none"
      />
    </div>
  );
  
  export default Header;
  