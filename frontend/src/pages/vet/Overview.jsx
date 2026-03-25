import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Overview = () => {

  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [stats, setStats] = useState({
    totalAnimals: 0,
    healthy: 0,
    sick: 0,
    vaccines: 0,
    highRisk: 0,
    pendingAppointments: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    setLoading(true);

    Promise.all([
      api.get("/animals/"),
      api.get("/vaccinations/"),
      api.get("/appointments/list/"),
      api.get("/predictions/vet/pending/")
    ])

      .then(([animalsRes, vaccinesRes, appointmentsRes, casesRes]) => {

        const animalsData = animalsRes.data;
        const vaccinesData = vaccinesRes.data;
        const appointmentsData = appointmentsRes.data;
        const casesData = casesRes.data;

        setAnimals(animalsData);
        setVaccines(vaccinesData);
        setAppointments(appointmentsData);
        setCases(casesData);

        setStats({

          totalAnimals: animalsData.length,

          healthy: animalsData.filter(
            (a) => a.status?.toLowerCase() === "healthy"
          ).length,

          sick: animalsData.filter(
            (a) => a.status?.toLowerCase() !== "healthy"
          ).length,

          vaccines: vaccinesData.filter(
            (v) => v.status?.toLowerCase() === "upcoming"
          ).length,

          highRisk: casesData.filter(
            (c) => c.severity?.toLowerCase() === "severe"
          ).length,

          pendingAppointments: appointmentsData.filter(
            (a) => a.status?.toLowerCase() === "pending"
          ).length

        });

      })

      .catch((err) => {
        console.log(err.response?.data);
        setError("Failed to load dashboard data");
      })

      .finally(() => setLoading(false));

  }, []);

  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (

    <div className="bg-gray-50 min-h-screen p-6">

      {/* Header */}

      <div className="flex justify-between items-center mb-8">

        <div>
          <h1 className="text-2xl font-bold">
            Welcome back!
          </h1>

          <p className="text-gray-500">
            Here's an overview of animal health activity
          </p>
        </div>

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/vet/add-animal")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + Add Animal
          </button>

          <button
            onClick={() => navigate("/vet/disease-prediction")}
            className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
          >
            Check Health
          </button>

          <button
            onClick={() => navigate("/vet/risk-prediction")}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg"
          >
            Risk Analysis
          </button>

        </div>

      </div>

      {/* Error */}

      {error && (
        <p className="text-red-500 mb-6">
          {error}
        </p>
      )}

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">

        {[
          { title: "Total Animals", value: stats.totalAnimals },
          { title: "Healthy", value: stats.healthy },
          { title: "Sick/Critical", value: stats.sick },
          { title: "Upcoming Vaccines", value: stats.vaccines },
          { title: "High Risk Animals", value: stats.highRisk },
          { title: "Pending Appointments", value: stats.pendingAppointments },
        ].map((card, index) => (

          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <p className="text-xs text-gray-500">
              {card.title}
            </p>

            <h2 className="text-xl font-bold">
              {card.value}
            </h2>

          </div>

        ))}

      </div>

      {/* Middle Section */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Health Distribution */}

        <div className="bg-white p-6 rounded-xl shadow md:col-span-2">

          <h3 className="font-semibold mb-4">
            Health Status Distribution
          </h3>

          <div className="flex justify-center items-center h-40">

            <div className="w-32 h-32 rounded-full border-[20px] border-green-500"></div>

          </div>

          <p className="text-center text-sm text-gray-500 mt-2">
            Healthy Animals: {stats.healthy}
          </p>

        </div>

        {/* Upcoming Vaccines */}

        <div className="bg-white p-6 rounded-xl shadow">

          <div className="flex justify-between mb-4">

            <h3 className="font-semibold">
              Upcoming Vaccines
            </h3>

            <button
              onClick={() => navigate("/vet/vaccinations")}
              className="text-green-600 text-sm"
            >
              View All
            </button>

          </div>

          {vaccines.slice(0, 3).map((v) => (

            <div
              key={v.id}
              className="bg-blue-50 p-3 rounded-lg mb-2"
            >

              <p className="font-medium">
                {v.vaccine_name}
              </p>

              <p className="text-sm text-gray-500">
                {v.animal} • {v.next_due_date}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* High Risk Alerts */}

      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <div className="flex justify-between mb-4">

          <h3 className="font-semibold text-red-600">
            High Risk Alerts
          </h3>

          <button
            onClick={() => navigate("/vet/cases")}
            className="text-red-500 text-sm"
          >
            View
          </button>

        </div>

        {cases.length > 0 ? (

          cases.slice(0, 3).map((c) => (

            <div
              key={c.id}
              className="bg-red-50 p-4 rounded-lg mb-2"
            >

              <p className="font-medium">
                {c.animal_name || "Unknown"}
              </p>

              <p className="text-sm text-gray-500">
                {c.predicted_disease}
              </p>

            </div>

          ))

        ) : (

          <p className="text-gray-400">
            No high risk alerts
          </p>

        )}

      </div>

      {/* Animals */}

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-4">

          <h3 className="font-semibold">
            Recent Animals
          </h3>

          <button
            onClick={() => navigate("/vet/animals")}
            className="text-green-600 text-sm"
          >
            View All
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {animals.slice(0, 4).map((animal) => (

            <div
              key={animal.id}
              className="bg-gray-50 p-4 rounded-lg"
            >

              <p className="font-medium">
                {animal.name}
              </p>

              <p className="text-sm text-gray-500">
                {animal.species}
              </p>

              <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {animal.status}
              </span>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

};

export default Overview;