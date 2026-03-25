import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, animals: 0, records: 0, diseases: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get("/users/"),
      api.get("/animals/"),
      api.get("/predictions/"),
      api.get("/diseases/")
    ])
      .then(([usersRes, animalsRes, recordsRes, diseasesRes]) => {
        setStats({
          users: usersRes.data.length,
          animals: animalsRes.data.length,
          records: recordsRes.data.length,
          diseases: diseasesRes.data.length,
        });
      })
      .catch(() => setError("Failed to load admin stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Users</p>
          <h2 className="text-xl font-bold">{stats.users}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Total Animals</p>
          <h2 className="text-xl font-bold">{stats.animals}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Health Records</p>
          <h2 className="text-xl font-bold">{stats.records}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">Diseases in DB</p>
          <h2 className="text-xl font-bold">{stats.diseases}</h2>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => navigate("/admin/users")}
          className="bg-blue-100 p-4 rounded shadow text-left"
        >
          Manage Users
        </button>

        <button
          onClick={() => navigate("/admin/animals")}
          className="bg-green-100 p-4 rounded shadow text-left"
        >
          Manage Animals
        </button>

        <button
          onClick={() => navigate("/admin/diseases")}
          className="bg-yellow-100 p-4 rounded shadow text-left"
        >
          Disease Database
        </button>

        <button
          onClick={() => navigate("/admin/reports")}
          className="bg-purple-100 p-4 rounded shadow text-left"
        >
          Analytics & Reports
        </button>
      </div>
    </div>
  );
};

export default Dashboard;