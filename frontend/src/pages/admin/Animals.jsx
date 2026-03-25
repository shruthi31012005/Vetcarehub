import { useEffect, useState } from "react";
import api from "../../services/api";

const Animals = () => {
  const [search, setSearch] = useState("");
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch(() => setError("Failed to load animals"))
      .finally(() => setLoading(false));
  }, []);

  const filteredAnimals = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(search.toLowerCase()) ||
      (animal.owner_name && animal.owner_name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Manage Animals</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 mb-4 rounded"
      />

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Species</th>
              <th className="p-3 text-left">Owner</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredAnimals.map((animal) => (
              <tr key={animal.id} className="border-b">
                <td className="p-3">{animal.name}</td>
                <td className="p-3">{animal.species}</td>
                <td className="p-3">{animal.owner_name}</td>
                <td className="p-3">{animal.status}</td>
              </tr>
            ))}

            {filteredAnimals.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No animals found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Animals;