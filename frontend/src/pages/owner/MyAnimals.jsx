import { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const MyAnimals = () => {

  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAnimals = async () => {

    setLoading(true);
    setError("");

    try {

      const res = await api.get("/animals/");

      setAnimals(res.data);
      setFilteredAnimals(res.data);

    } catch (err) {

      console.log(err.response?.data);
      setError("Failed to load animals");

    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  // SEARCH + FILTER
  useEffect(() => {

    let data = [...animals];

    if (search) {
      data = data.filter((a) =>
        a.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      data = data.filter(
        (a) => a.category?.toLowerCase() === categoryFilter
      );
    }

    if (statusFilter !== "all") {
      data = data.filter(
        (a) => a.status?.toLowerCase() === statusFilter
      );
    }

    setFilteredAnimals(data);

  }, [search, categoryFilter, statusFilter, animals]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">My Animals</h1>
          <p className="text-gray-500">
            Manage and monitor your animals
          </p>
        </div>

        <button
          onClick={() => navigate("/owner/add-animal")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
        >
          + Add Animal
        </button>

      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">

        <input
          type="text"
          placeholder="Search animals..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border p-2 rounded-lg"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="all">All Categories</option>
          <option value="livestock">Livestock</option>
          <option value="pets">Pets</option>
          <option value="poultry">Poultry</option>
          <option value="wild">Wild</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >
          <option value="all">All Status</option>
          <option value="healthy">Healthy</option>
          <option value="sick">Sick</option>
          <option value="critical">Critical</option>
        </select>

        {/* VIEW TOGGLE */}
        <div className="flex gap-2">

          <button
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid"
                ? "px-3 py-2 rounded bg-green-600 text-white"
                : "px-3 py-2 rounded bg-gray-200"
            }
          >
            Grid
          </button>

          <button
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list"
                ? "px-3 py-2 rounded bg-green-600 text-white"
                : "px-3 py-2 rounded bg-gray-200"
            }
          >
            List
          </button>

        </div>

      </div>

      {/* LOADING */}
      {loading && <p className="text-gray-500">Loading animals...</p>}
      {/* ERROR */}
      {error && <p className="text-red-500">{error}</p>}

      {/* EMPTY */}
      {!loading && filteredAnimals.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No animals found.
        </div>
      )}

      {/* GRID VIEW */}
      {viewMode === "grid" && (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {filteredAnimals.map((animal) => (

            <div
              key={animal.id}
              onClick={() => navigate(`/owner/animal/${animal.id}`)}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >

              <div className="flex justify-center mb-4">

                {animal.image ? (

                  <img
                    src={`${animal.image}`}
                    alt={animal.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                ) : (

                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl">
                    🐾
                  </div>

                )}

              </div>

              <h3 className="text-center font-semibold text-lg">
                {animal.name}
              </h3>

              <p className="text-center text-gray-500 text-sm">
                {animal.species} • {animal.breed}
              </p>

              <div className="flex justify-center mt-3">

                <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full">
                  {animal.status}
                </span>

              </div>

              <p className="text-center text-gray-400 text-sm mt-2">
                Age: {animal.age_years}y {animal.age_months}m
              </p>

            </div>

          ))}

        </div>

      )}

      {/* LIST VIEW */}
      {viewMode === "list" && (

        <div className="space-y-4">

          {filteredAnimals.map((animal) => (

            <div
              key={animal.id}
              onClick={() => navigate(`/owner/animal/${animal.id}`)}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center cursor-pointer hover:shadow-md"
            >

              <div>

                <h3 className="font-semibold">
                  {animal.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {animal.species} • {animal.breed}
                </p>

                <p className="text-sm text-gray-400">
                  Age: {animal.age_years}y {animal.age_months}m
                </p>

              </div>

              <span className="text-xs px-3 py-1 bg-green-100 text-green-600 rounded-full">
                {animal.status}
              </span>

            </div>

          ))}

        </div>

      )}

    </div>
  );
};

export default MyAnimals;