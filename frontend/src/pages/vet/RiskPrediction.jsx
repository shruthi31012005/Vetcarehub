import { useState, useEffect } from "react";
import api from "../../services/api";

import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

const geoUrl =
"https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const RiskPrediction = () => {

  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState("");

  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch(() => setError("Failed to load animals"));

  }, []);

  const handleAnalyze = async () => {

    if (!selectedAnimal) return;

    setLoading(true);
    setError("");

    try {

      const res = await api.post("/predictions/risk/", {
        animal_id: selectedAnimal
      });

      setResult(res.data);

    } catch {

      setError("Risk prediction failed");

    }

    setLoading(false);

  };

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          Veterinary Risk Assessment
        </h1>

        <p className="text-gray-500">
          AI-powered predictive risk analysis for clinical decision support
        </p>

      </div>

      {/* ANIMAL SELECT */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h2 className="font-semibold mb-4">
          Select Animal
        </h2>

        <div className="flex gap-4">

          <select
            className="flex-1 border p-3 rounded"
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
          >

            <option value="">
              Select Animal
            </option>

            {animals.map((animal) => (

              <option key={animal.id} value={animal.id}>
                {animal.name} ({animal.species})
              </option>

            ))}

          </select>

          <button
            onClick={handleAnalyze}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Analyze Risk
          </button>

        </div>

      </div>

      {loading && (
        <div className="bg-blue-100 p-4 rounded mb-6">
          Running AI analysis...
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded mb-6">
          {error}
        </div>
      )}

      {result && (

        <div className="space-y-6">

          {/* RISK SUMMARY */}

          <div className="bg-white p-6 rounded-xl shadow">

            <div className="flex justify-between items-center">

              <h2 className="text-xl font-bold">
                {result.animal_name} Risk Assessment
              </h2>

              <span className="bg-yellow-200 px-3 py-1 rounded text-sm">
                {result.risk_level}
              </span>

            </div>

            {/* SCORE BAR */}

            <div className="mt-4">

              <div className="flex justify-between text-sm mb-1">
                <span>Risk Score</span>
                <span>{result.risk_score}/100</span>
              </div>

              <div className="bg-gray-200 h-3 rounded">

                <div
                  className="bg-black h-3 rounded"
                  style={{ width: `${result.risk_score}%` }}
                />

              </div>

            </div>

            <p className="mt-4 text-gray-600">
              {result.summary}
            </p>

          </div>

          {/* FUTURE DISEASES */}

          <div className="bg-red-50 p-6 rounded-xl">

            <h3 className="font-semibold mb-3">
              Potential Future Diseases
            </h3>

            <div className="flex flex-wrap gap-2">

              {result.future_diseases.map((disease, index) => (
                <span
                  key={index}
                  className="bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
                >
                  {disease}
                </span>

              ))}

            </div>

          </div>

          {/* RISK FACTORS */}

          <div className="bg-orange-50 p-6 rounded-xl">

            <h3 className="font-semibold mb-3">
              Identified Risk Factors
            </h3>

            <ul className="list-disc pl-6 space-y-1">

              {result.risk_factors.map((factor, index) => (

                <li key={index}>
                  {factor}
                </li>

              ))}

            </ul>

          </div>

          {/* PREVENTION */}

          <div className="bg-green-50 p-6 rounded-xl">

            <h3 className="font-semibold mb-3">
              Preventive Recommendations
            </h3>

            <ul className="list-disc pl-6 space-y-1">

              {result.recommendations.map((rec, index) => (

                <li key={index}>
                  {rec}
                </li>

              ))}

            </ul>

          </div>

          {/* ADDITIONAL CLINICAL NOTES */}

          <div className="grid md:grid-cols-2 gap-4">

            <div className="bg-blue-50 p-5 rounded">

              <h3 className="font-semibold mb-2">
                Vaccination Status
              </h3>

              <p>
                {result.vaccination_advice}
              </p>

            </div>

            <div className="bg-purple-50 p-5 rounded">

              <h3 className="font-semibold mb-2">
                Dietary Advice
              </h3>

              <p>
                {result.diet_advice}
              </p>

            </div>

          </div>

          {/* MONITORING */}

          <div className="bg-gray-100 p-6 rounded">

            <h3 className="font-semibold mb-2">
              Monitoring Advice
            </h3>

            <p>
              {result.monitoring}
            </p>

          </div>

          {/* GLOBAL HEATMAP */}

          <div className="bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold mb-4">
              Global Disease Risk Heatmap
            </h3>

            <ComposableMap>

              <Geographies geography={geoUrl}>

                {({ geographies }) =>
                  geographies.map((geo) => (

                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      style={{
                        default: {
                          fill: "#E5E7EB",
                          outline: "none"
                        },
                        hover: {
                          fill: "#F87171",
                          outline: "none"
                        }
                      }}
                    />

                  ))
                }

              </Geographies>

            </ComposableMap>

          </div>

        </div>

      )}

    </div>

  );

};

export default RiskPrediction;