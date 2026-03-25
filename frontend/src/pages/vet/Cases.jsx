import { useState, useEffect } from "react";

import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Cases = () => {

  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [status, setStatus] = useState("All Status");
  const [priority, setPriority] = useState("All Priority");
  const [search, setSearch] = useState("");

  // Fetch cases
  useEffect(() => {

    setLoading(true);

    api.get("/cases/vet/")
      .then((res) => {
        setCases(res.data);
        setFilteredCases(res.data);
      })
      .catch(() => setError("Failed to load cases"))
      .finally(() => setLoading(false));

  }, []);

  // Filtering logic
  useEffect(() => {

    let data = [...cases];

    if (status !== "All Status") {
      data = data.filter(
        (c) => c.status?.toLowerCase() === status.toLowerCase()
      );
    }

    if (priority !== "All Priority") {
      data = data.filter(
        (c) => c.priority?.toLowerCase() === priority.toLowerCase()
      );
    }

    if (search) {
      data = data.filter(
        (c) =>
          c.predicted_disease?.toLowerCase().includes(search.toLowerCase()) ||
          c.animal_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFilteredCases(data);

  }, [status, priority, search, cases]);

  const navigate = useNavigate();
  // Priority color
  const priorityColor = (priority) => {

    switch (priority?.toLowerCase()) {

      case "emergency":
        return "bg-red-100 text-red-600";

      case "high":
        return "bg-orange-100 text-orange-600";

      case "medium":
        return "bg-yellow-100 text-yellow-600";

      case "low":
        return "bg-green-100 text-green-600";

      default:
        return "bg-gray-100 text-gray-600";
    }

  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Case Management
        </h1>

        <p className="text-sm text-gray-500">
          Review and respond to animal health cases
        </p>
      </div>

      {/* FILTERS */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">

        {/* Search */}
        <input
          type="text"
          placeholder="Search cases..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option>All Status</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          <option>All Priority</option>
          <option>Emergency</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500 mb-6">
          Loading cases...
        </p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500 mb-6">{error}</p>
      )}

      {/* CASES LIST */}
      {filteredCases.length > 0 ? (

        <div className="space-y-4">

          {filteredCases.map((c) => (

            <div
              key={c.id}
              className="bg-white p-5 rounded-xl shadow-sm flex justify-between items-center"
            >

              <div>
                <h3 className="font-semibold text-gray-800">
                  {c.predicted_disease}
                </h3>

                <p className="text-sm text-gray-500">
                  Animal: {c.animal_name || "Unknown"}
                </p>

                <p className="text-sm text-gray-400">
                  Confidence: {c.confidence}%
                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className={`px-3 py-1 rounded-full text-xs ${priorityColor(c.priority)}`}>
                  {c.priority || "medium"}
                </span>

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded-md text-sm hover:bg-green-700"
                  onClick={() => navigate(`/vet/cases/${c.id}`)}
                >
                  Review
                </button>

              </div>

            </div>

          ))}

        </div>

      ) : (

        <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center">

          <div className="text-gray-300 text-6xl mb-4">
            📄
          </div>

          <h3 className="text-lg font-semibold text-gray-700">
            No cases found
          </h3>

          <p className="text-sm text-gray-500">
            No consultations assigned to you yet
          </p>

        </div>

      )}

    </div>
  );
};

export default Cases;