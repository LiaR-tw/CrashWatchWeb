type Institution = {
    name: string;
    type: string;
    phone: string;
    email: string;
    city: string;
    status: "Active" | "Inactive";
  };
  
  const institutions: Institution[] = [
    { name: "Univalle", type: "Hospital", phone: "+591 95566117", email: "univalle231@gmail.com", city: "Cochabamba", status: "Active" },
    { name: "Viedman", type: "Hospital", phone: "+591 95566117", email: "viedma885@yahoo.com", city: "Cochabamba", status: "Inactive" },
    { name: "Transit", type: "Police", phone: "+591 8723952", email: "ronald@adobe.com", city: "Cochabamba", status: "Inactive" },
    { name: "Comand", type: "Police", phone: "+591 7832159", email: "marvin@tesla.com", city: "Cochabamba", status: "Active" },
    { name: "Sar", type: "Firefighters", phone: "+10 97881541", email: "jerome@google.com", city: "Santa Cruz", status: "Active" },
  ];
  
  const InstitutionsTable: React.FC = () => (
    <div className="px-8 py-6">
      <h2 className="text-2xl font-bold mb-4">All Institutions</h2>
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          className="border rounded-lg px-4 py-2 w-1/3 text-gray-600 focus:outline-none"
        />
        <select className="border rounded-lg px-4 py-2 text-gray-600 focus:outline-none">
          <option value="newest">Sort by: Newest</option>
          <option value="oldest">Sort by: Oldest</option>
        </select>
      </div>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Phone</th>
            <th className="py-2 px-4">Email</th>
            <th className="py-2 px-4">City</th>
            <th className="py-2 px-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {institutions.map((institution, index) => (
            <tr key={index} className="border-b">
              <td className="py-2 px-4">{institution.name}</td>
              <td className="py-2 px-4">{institution.type}</td>
              <td className="py-2 px-4">{institution.phone}</td>
              <td className="py-2 px-4">{institution.email}</td>
              <td className="py-2 px-4">{institution.city}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-3 py-1 rounded-lg text-sm ${
                    institution.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}
                >
                  {institution.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  export default InstitutionsTable;
  