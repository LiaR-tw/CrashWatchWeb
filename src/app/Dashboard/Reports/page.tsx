type Report = {
  id: number;
  title: string;
  date: string;
  status: "Pending" | "Completed";
};

const reports: Report[] = [
  { id: 1, title: "Annual Report 2024", date: "2024-10-15", status: "Completed" },
  { id: 2, title: "Incident Report", date: "2024-10-20", status: "Pending" },
  { id: 3, title: "Monthly Analysis", date: "2024-11-01", status: "Completed" },
];

const ReportsTable: React.FC = () => (
  <div className="mt-6">
    <h2 className="text-2xl font-bold mb-4">All Reports</h2>
    <table className="min-w-full bg-white rounded-lg shadow">
      <thead className="bg-gray-100">
        <tr>
          <th className="py-2 px-4">ID</th>
          <th className="py-2 px-4">Title</th>
          <th className="py-2 px-4">Date</th>
          <th className="py-2 px-4">Status</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id} className="border-b">
            <td className="py-2 px-4">{report.id}</td>
            <td className="py-2 px-4">{report.title}</td>
            <td className="py-2 px-4">{report.date}</td>
            <td className="py-2 px-4">
              <span
                className={`px-3 py-1 rounded-lg text-sm ${
                  report.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {report.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ReportsTable;
