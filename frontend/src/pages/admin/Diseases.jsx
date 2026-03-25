import { useEffect, useState } from "react";
import api from "../../services/api";

const Diseases = () => {
  const [open, setOpen] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newDisease, setNewDisease] = useState({ name: "", description: "" });

  useEffect(() => {
    setLoading(true);
    api.get("/diseases/")
      .then((res) => setDiseases(res.data))
      .catch(() => setError("Failed to load diseases"))
      .finally(() => setLoading(false));
  }, []);

  const handleAddDisease = async () => {
    setLoading(true);
    setError("");
    try {
      await api.post("/diseases/", newDisease);
      setOpen(false);
      setNewDisease({ name: "", description: "" });
      // Refresh list
      const res = await api.get("/diseases/");
      setDiseases(res.data);
    } catch (err) {
      setError("Failed to add disease");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Disease Database</h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Disease
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-lg font-bold mb-4">Add New Disease</h2>
            <input
              type="text"
              placeholder="Disease Name"
              className="w-full border p-2 mb-3 rounded"
              value={newDisease.name}
              onChange={(e) => setNewDisease({ ...newDisease, name: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="w-full border p-2 mb-3 rounded"
              value={newDisease.description}
              onChange={(e) => setNewDisease({ ...newDisease, description: e.target.value })}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button className="bg-green-500 text-white px-3 py-1 rounded" onClick={handleAddDisease}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
      {loading && <div className="flex justify-center items-center h-screen">Loading...</div>}
      {error && <div className="flex justify-center items-center h-screen">{error}</div>}
      <ul>
        {diseases.map((disease) => (
          <li key={disease._id}>{disease.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Diseases;