import { useState, useEffect } from "react";
import api from "../../services/api";

const Appointments = () => {

  const [appointments, setAppointments] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [animal, setAnimal] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================

  useEffect(() => {

    api.get("/appointments/list/")
      .then((res) => setAppointments(res.data))
      .catch(() => setError("Failed to load appointments"));

    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch(() => setError("Failed to load animals"));

  }, []);

  // ================= BOOK APPOINTMENT =================

  const handleBook = async () => {

    if (!animal || !date || !time || !reason) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await api.post("/appointments/book/", {
        animal_id: parseInt(animal),
        appointment_date: date,
        appointment_time: time,
        reason: reason,
      });

      setAppointments([...appointments, res.data]);

      setAnimal("");
      setDate("");
      setTime("");
      setReason("");

      setShowModal(false);

    } catch (err) {

      console.log(err.response?.data);
      setError("Booking failed");

    }

    setLoading(false);

  };

  // ================= CANCEL APPOINTMENT =================

  const cancelAppointment = async (id) => {

    try {

      await api.post(`/appointments/cancel/${id}/`);

      const updated = await api.get("/appointments/list/");
      setAppointments(updated.data);

    } catch (err) {

      console.log(err.response?.data);
      setError("Cancel failed");

    }

  };

  // ================= STATUS COUNTER =================

  const countStatus = (status) =>
    appointments.filter(
      (a) => a.status?.toLowerCase() === status.toLowerCase()
    ).length;

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-gray-500">
            Book and track your veterinary appointments
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          + Book Appointment
        </button>

      </div>

      {/* STATUS CARDS */}

      <div className="grid grid-cols-4 gap-4 mb-6">

        {["pending", "confirmed", "completed", "cancelled"].map((status) => (

          <div
            key={status}
            className="bg-white rounded-xl shadow p-4 text-center"
          >

            <p className="text-xl font-bold">
              {countStatus(status)}
            </p>

            <p className="text-sm text-gray-500 capitalize">
              {status}
            </p>

          </div>

        ))}

      </div>

      {/* APPOINTMENTS LIST */}

      <div className="space-y-4">

        {appointments.map((a) => (

          <div
            key={a.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
          >

            <div>

              <h3 className="font-semibold">
                {a.animal}
              </h3>

              <p className="text-sm text-gray-500">
                {a.reason}
              </p>

              <p className="text-sm text-gray-400">
                {a.appointment_date} • {a.appointment_time}
              </p>

            </div>

            <div className="flex gap-3 items-center">
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  a.status?.toLowerCase() === "cancelled"
                    ? "bg-gray-200 text-gray-600"
                    : a.status?.toLowerCase() === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : a.status?.toLowerCase() === "confirmed"
                    ? "bg-green-100 text-green-600"
                    : a.status?.toLowerCase() === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {a.status}
              </span>

              {a.status?.toLowerCase() !== "cancelled" && (

                <button
                  onClick={() => cancelAppointment(a.id)}
                  className="text-red-500"
                >
                  Cancel
                </button>

              )}

            </div>

          </div>

        ))}

      </div>

      {/* ================= BOOK MODAL ================= */}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white rounded-xl p-6 w-96 relative">

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500"
            >
              ✕
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Book Veterinary Appointment
            </h2>

            <div className="space-y-4">

              {/* Animal */}

              <select
                value={animal}
                onChange={(e) => setAnimal(e.target.value)}
                className="w-full border p-2 rounded"
              >

                <option value="">
                  Select Animal *
                </option>

                {animals.map((a) => (

                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>

                ))}

              </select>

              {/* Date */}

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border p-2 rounded"
              />

              {/* Time */}

              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border p-2 rounded"
              />

              {/* Reason */}

              <textarea
                rows="3"
                placeholder="Describe the issue..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border p-2 rounded"
              />

              {/* Buttons */}

              <div className="flex justify-end gap-3 pt-3">

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleBook}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  {loading ? "Booking..." : "Book Appointment"}
                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default Appointments;