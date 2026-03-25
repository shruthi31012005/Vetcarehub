import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const HealthRecords = () => {

  const [records, setRecords] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [animalFilter, setAnimalFilter] = useState("All");

  const navigate = useNavigate();

  useEffect(() => {

    api.get("/predictions/owner/health-records/")
      .then((res) => {
        setRecords(res.data);
        setFiltered(res.data);
      })
      .catch((err) => {
        console.log(err.response?.data);
      });

  }, []);

  useEffect(() => {

    let data = records;

    if (animalFilter !== "All") {
      data = data.filter((r) => r.animal === animalFilter);
    }

    if (search) {
      data = data.filter((r) =>
        r.predicted_disease?.toLowerCase().includes(search.toLowerCase())
      );
    }

    setFiltered(data);

  }, [search, animalFilter, records]);

  const severityColor = (severity) => {

    if (!severity) return "bg-gray-200 text-gray-600";

    if (severity.toLowerCase() === "low")
      return "bg-green-100 text-green-600";

    if (severity.toLowerCase() === "moderate")
      return "bg-orange-100 text-orange-600";

    if (severity.toLowerCase() === "severe")
      return "bg-red-100 text-red-600";

    return "bg-gray-200";

  };

  const uniqueAnimals = ["All", ...new Set(records.map((r) => r.animal))];

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Health Records Timeline
      </h1>

      {/* Search + Filter */}

      <div className="flex flex-wrap gap-4 mb-6">

        <input
          type="text"
          placeholder="Search disease..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg"
        />

        <select
          value={animalFilter}
          onChange={(e) => setAnimalFilter(e.target.value)}
          className="border p-2 rounded-lg"
        >

          {uniqueAnimals.map((animal) => (

            <option key={animal}>
              {animal}
            </option>

          ))}

        </select>

      </div>

      {/* Timeline */}

      <div className="relative border-l-2 border-gray-300 pl-6 space-y-8">

        {filtered.map((record) => (

          <div
            key={record.id}
            className="relative cursor-pointer"
            onClick={() =>
              navigate(`/owner/health-records/${record.id}`)
            }
          >

            <div className="absolute -left-3 top-2 w-5 h-5 bg-green-500 rounded-full border-4 border-white"></div>

            <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">

              <div className="flex justify-between items-center">

                <div>

                  <h3 className="font-semibold text-lg">
                    {record.predicted_disease}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {record.animal}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 text-xs rounded-full ${severityColor(record.severity)}`}
                >
                  {record.severity}
                </span>

              </div>

              <div className="mt-3 text-sm text-gray-600">
                Confidence: {record.confidence}%
              </div>

              <div className="text-xs text-gray-400 mt-2">
                {new Date(record.created_at).toLocaleString()}
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

};

export default HealthRecords;