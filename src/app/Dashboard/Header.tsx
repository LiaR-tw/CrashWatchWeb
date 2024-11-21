const Header: React.FC = () => (
  <div className="flex justify-between items-center px-8 py-4 bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] shadow-md">
    {/* Título centrado y con letras blancas */}
    <h1 className="text-3xl font-bold text-white flex-1 text-center">
      Hello Admin 👋
    </h1>

    {/* Campo de búsqueda */}
    <input
      type="text"
      placeholder="Search"
      className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none"
    />
  </div>
);

export default Header;
