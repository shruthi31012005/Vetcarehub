import { useEffect, useState } from "react";
import api from "../../services/api";

const Appointments = () => {

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAppointments = () => {
    setLoading(true);

    api.get("/appointments/list/")
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to load appointments"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Confirm appointment
  const confirmAppointment = async (id) => {
    try {
      await api.post(`/appointments/confirm/${id}/`);
      fetchAppointments();
    } catch {
      setError("Failed to confirm appointment");
    }
  };

  // Complete appointment
  const completeAppointment = async (id) => {
    try {
      await api.post(`/appointments/complete/${id}/`);
      fetchAppointments();
    } catch {
      setError("Failed to complete appointment");
    }
  };

  // Reject appointment
  const rejectAppointment = async (id) => {
    try {
      await api.post(`/appointments/reject/${id}/`);
      fetchAppointments();
    } catch {
      setError("Failed to reject appointment");
    }
  };

  // Count appointments by status
  const countStatus = (status) =>
    appointments.filter((a) => a.status === status).length;

  // Status color
  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "confirmed":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "completed":
        return "bg-blue-100 text-blue-600";
      case "cancelled":
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* HEADER */}
      <div className="mb-8 flex items-center gap-3">
        <div className="text-blue-500 text-2xl">📅</div>

        <div>
          <h1 className="text-2xl font-bold">
            Appointments
          </h1>
          <p className="text-gray-500 text-sm">
            Manage appointment requests from animal owners
          </p>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <p className="text-red-500 mb-6">{error}</p>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            {countStatus("pending")}
          </h2>
          <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-1 rounded">
            Pending
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            {countStatus("confirmed")}
          </h2>
          <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">
            Confirmed
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            {countStatus("rejected")}
          </h2>
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
            Rejected
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            {countStatus("completed")}
          </h2>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
            Completed
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl shadow text-center">
          <h2 className="text-2xl font-bold">
            {countStatus("cancelled")}
          </h2>
          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
            Cancelled
          </span>
        </div>

      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 mb-6">
          Loading appointments...
        </p>
      )}

      {/* APPOINTMENTS */}
      {appointments.length > 0 ? (

        <div className="space-y-4">

          {appointments.map((a) => {

            const animal = a.animal_details;

            return (
              <div
                key={a.id}
                className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
              >

                <div>
                  <h3 className="font-semibold">
                    {animal
                      ? `${animal.species.charAt(0).toUpperCase() + animal.species.slice(1)}: ${animal.name}`
                      : "Animal"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {a.reason}
                  </p>

                  <p className="text-xs text-gray-400">
                    {a.appointment_date} • {a.appointment_time}
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <span className={`text-xs px-2 py-1 rounded ${statusColor(a.status)}`}>
                    {a.status}
                  </span>

                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => confirmAppointment(a.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Confirm
                      </button>

                      <button
                        onClick={() => rejectAppointment(a.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {a.status === "confirmed" && (
                    <button
                      onClick={() => completeAppointment(a.id)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Complete
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">

          <div className="text-gray-300 text-6xl mb-4">
            📅
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            No appointment requests
          </h3>

        </div>

      )}

    </div>
  );
};

export default Appointments;