import VetLayout from "../../layouts/VetLayout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../services/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    predictions: 0,
  });

  const [predictions, setPredictions] = useState([]);
  const [consultations, setConsultations] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    Promise.all([
      api.get("/predictions/vet/pending/"),
      api.get("/predictions/vet/reviewed/"),
      api.get("/appointments/list/")
    ])
      .then(([pendingRes, reviewedRes, consultRes]) => {

        setStats({
          pending: pendingRes.data.length,
          inProgress: 0,
          completed: reviewedRes.data.length,
          predictions: pendingRes.data.length
        });

        setPredictions(pendingRes.data.slice(0, 5)); // show first 5
        setConsultations(consultRes.data.slice(0, 5));

      })
      .catch(() => setError("Failed to load vet dashboard"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Veterinary Dashboard
          </h1>
          <p className="text-gray-500">
            Welcome back, Dr. Shruthi
          </p>
        </div>

        <button
          onClick={() => navigate("/vet/cases")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
        >
          View All Cases
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {/* STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        {/* Pending */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Pending Cases</p>
            <h2 className="text-2xl font-bold">{stats.pending}</h2>
          </div>
          <div className="w-10 h-10 bg-yellow-100 text-yellow-600 flex items-center justify-center rounded-lg">
            ⚠️
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">In Progress</p>
            <h2 className="text-2xl font-bold">{stats.inProgress}</h2>
          </div>
          <div className="w-10 h-10 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg">
            ⏳
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">Completed</p>
            <h2 className="text-2xl font-bold">{stats.completed}</h2>
          </div>
          <div className="w-10 h-10 bg-green-100 text-green-600 flex items-center justify-center rounded-lg">
            ✅
          </div>
        </div>

        {/* AI Predictions */}
        <div className="bg-white p-5 rounded-2xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">AI Predictions</p>
            <h2 className="text-2xl font-bold text-purple-600">
              {stats.predictions}
            </h2>
          </div>
          <div className="w-10 h-10 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg">
            🧠
          </div>
        </div>

      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Case Priority */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            ⚠️ Case Priority
          </h3>

          {predictions.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No case data
            </p>
          ) : (
            predictions.slice(0,3).map((p) => (
              <div key={p.id} className="text-sm mb-2">
                {p.predicted_disease}
              </div>
            ))
          )}

        </div>

        {/* Recent Consultations */}
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              📄 Recent Consultations
            </h3>

            <button
              onClick={() => navigate("/vet/appointments")}
              className="text-green-600 text-sm hover:underline"
            >
              View All
            </button>
          </div>

          {consultations.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No consultations yet
            </p>
          ) : (
            consultations.map((c) => (
              <div key={c.id} className="text-sm mb-2">
                {c.reason}
              </div>
            ))
          )}

        </div>

      </div>

      {/* AI PREDICTIONS LIST */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        <h3 className="font-semibold mb-6">
          AI Predictions Awaiting Review
        </h3>

        <div className="space-y-4">

          {predictions.length === 0 ? (
            <p className="text-gray-400 text-sm">
              No AI predictions pending
            </p>
          ) : (
            predictions.map((p) => (
              <div
                key={p.id}
                className="bg-purple-50 border border-purple-100 p-4 rounded-xl flex justify-between items-center"
              >

                <div>
                  <p className="font-medium">
                    AI Diagnosis: {p.predicted_disease}
                  </p>

                  <p className="text-sm text-gray-500">
                    Confidence: {p.confidence}%
                  </p>
                </div>

                <div className="flex items-center gap-3">

                  <span className="bg-yellow-100 text-yellow-600 text-xs px-2 py-1 rounded-full">
                    moderate
                  </span>

                  <button
                    onClick={() => navigate("/vet/ai")}
                    className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700 transition"
                  >
                    Review
                  </button>

                </div>

              </div>
            ))
          )}

        </div>
      </div>

    </div>
  );
};

export default Dashboard;