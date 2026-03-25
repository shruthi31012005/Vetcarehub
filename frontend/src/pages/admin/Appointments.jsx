import { useEffect, useState } from "react";
import api from "../../services/api";

const Appointments = () => {
  const [filter, setFilter] = useState("All");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/appointments/")
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to load appointments"))
      .finally(() => setLoading(false));
  }, []);

  const filteredAppointments =
    filter === "All"
      ? appointments
      : appointments.filter((appt) => appt.status === filter);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Appointments</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded shadow-sm"
        >
          <option>All</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Animal</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Veterinarian</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  {error}
                </td>
              </tr>
            ) : filteredAppointments.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appt) => (
                <tr key={appt.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{appt.animal?.name || appt.animal || "-"}</td>
                  <td className="p-3">{appt.owner?.name || appt.owner || "-"}</td>
                  <td className="p-3">{appt.vet?.name || appt.vet || "-"}</td>
                  <td className="p-3">{appt.date || appt.scheduled_date || "-"}</td>
                  <td className="p-3">
                    <select
                      defaultValue={appt.status}
                      className="border p-1 rounded"
                    >
                      <option>Scheduled</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline mr-3">
                      View
                    </button>
                    <button className="text-red-600 hover:underline">
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Appointments;