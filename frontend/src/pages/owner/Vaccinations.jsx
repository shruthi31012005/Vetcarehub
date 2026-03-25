import { useState, useEffect } from "react";
import api from "../../services/api";

const Vaccinations = () => {

  const [vaccines, setVaccines] = useState([]);
  const [animals, setAnimals] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [animal, setAnimal] = useState("");
  const [vaccineName, setVaccineName] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= Fetch Vaccinations =================

  const fetchVaccinations = async () => {

    try {

      const res = await api.get("/vaccinations/");
      setVaccines(res.data);

    } catch (err) {

      console.log(err.response?.data);
      setError("Failed to load vaccinations");

    }

  };

  // ================= Fetch Animals =================

  const fetchAnimals = async () => {

    try {

      const res = await api.get("/animals/");
      setAnimals(res.data);

    } catch (err) {

      console.log(err.response?.data);
      setError("Failed to load animals");

    }

  };

  useEffect(() => {

    fetchVaccinations();
    fetchAnimals();

  }, []);

  // ================= Schedule Vaccine =================

  const handleSchedule = async () => {

    if (!animal || !vaccineName || !scheduledDate) {

      alert("Please fill required fields");
      return;

    }

    setLoading(true);
    setError("");

    try {

      await api.post("/vaccinations/", {

        animal: animal,
        vaccine_name: vaccineName,
        date_administered: scheduledDate,
        next_due_date: scheduledDate,
        status: "upcoming",

      });

      await fetchVaccinations();

      setShowModal(false);
      setAnimal("");
      setVaccineName("");
      setScheduledDate("");

    } catch (err) {

      console.log("Backend Error:", err.response?.data);
      setError("Schedule failed");

    }

    setLoading(false);

  };

  // ================= Mark Complete =================

  const markComplete = async (id) => {

    try {

      await api.patch(`/vaccinations/${id}/`, {
        status: "completed"
      });

      await fetchVaccinations();

    } catch (err) {

      console.log(err.response?.data);
      setError("Mark complete failed");

    }

  };

  // ================= Delete Vaccine =================

  const deleteVaccine = async (id) => {

    try {

      await api.delete(`/vaccinations/${id}/`);
      await fetchVaccinations();

    } catch (err) {

      console.log(err.response?.data);
      setError("Delete failed");

    }

  };

  // ================= Summary =================

  const upcoming = vaccines.filter(
    (v) => v.status?.toLowerCase() === "upcoming"
  ).length;

  const completed = vaccines.filter(
    (v) => v.status?.toLowerCase() === "completed"
  ).length;

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Vaccinations
          </h1>

          <p className="text-gray-500">
            Manage vaccination schedules and reminders
          </p>

        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Schedule Vaccine
        </button>

      </div>

      {/* Summary */}

      <div className="grid grid-cols-2 gap-4 mb-6">

        <div className="bg-white p-6 rounded-xl shadow text-center">

          <h2 className="text-2xl font-bold">
            {upcoming}
          </h2>

          <p className="text-gray-500">
            Upcoming
          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">

          <h2 className="text-2xl font-bold text-green-600">
            {completed}
          </h2>

          <p className="text-gray-500">
            Completed
          </p>

        </div>

      </div>

      {/* Vaccine List */}
      {vaccines.map((v) => {

        const animalName =
          animals.find((a) => a.id === v.animal)?.name || "Unknown";

        return (

          <div
            key={v.id}
            className="bg-white rounded-xl shadow p-6 mb-4 flex justify-between items-center"
          >

            <div>

              <h2 className="font-semibold">
                {v.vaccine_name}
              </h2>

              <p className="text-sm text-gray-500">
                {animalName}
              </p>

              <p className="text-sm text-gray-400">
                Date: {v.date_administered}
              </p>

            </div>

            <div className="flex gap-3 items-center">

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  v.status?.toLowerCase() === "completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {v.status}
              </span>

              {v.status?.toLowerCase() !== "completed" && (

                <button
                  onClick={() => markComplete(v.id)}
                  className="bg-green-100 text-green-600 px-3 py-1 rounded"
                >
                  Complete
                </button>

              )}

              <button
                onClick={() => deleteVaccine(v.id)}
                className="text-red-500"
              >
                🗑
              </button>

            </div>

          </div>

        );

      })}

      {error && (
        <div className="text-red-500 mt-4">
          {error}
        </div>
      )}

      {/* Modal */}

      {showModal && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">

          <div className="bg-white rounded-xl p-6 w-96">

            <h2 className="text-lg font-semibold mb-4">
              Schedule Vaccination
            </h2>

            <select
              value={animal}
              onChange={(e) => setAnimal(Number(e.target.value))}
              className="border p-2 rounded w-full mb-3"
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

            <input
              value={vaccineName}
              onChange={(e) => setVaccineName(e.target.value)}
              placeholder="Vaccine Name *"
              className="border p-2 rounded w-full mb-3"
            />

            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />

            <div className="flex justify-between">

              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSchedule}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                {loading ? "Scheduling..." : "Schedule"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

};

export default Vaccinations;