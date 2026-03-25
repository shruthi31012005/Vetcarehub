import { useEffect, useState } from "react";
import api from "../../services/api";

const Reports = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/predictions/analytics/ai-performance/")
      .then((res) => setAnalytics(res.data))
      .catch(() => setError("Failed to load analytics"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Reports & Analytics</h1>

      <select className="border p-2 rounded mb-4">
        <option>Last 7 days</option>
        <option>Last 30 days</option>
        <option>Last 90 days</option>
        <option>All time</option>
      </select>

      {loading ? (
        <div className="bg-white p-6 rounded shadow">
          <p>Loading...</p>
        </div>
      ) : error ? (
        <div className="bg-white p-6 rounded shadow">
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <p>Charts will be displayed here (static for now)</p>
        </div>
      )}
    </div>
  );
};

export default Reports;