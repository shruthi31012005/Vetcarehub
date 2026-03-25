import { useState, useEffect } from "react";
import api from "../../services/api";

const RiskPrediction = () => {

  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    api.get("/animals/")
      .then(res => setAnimals(res.data))
      .catch(() => setError("Failed to load animals"));

  }, []);

  const handleAnalyze = async () => {

    if (!selectedAnimal) {
      alert("Please select an animal");
      return;
    }

    setLoading(true);
    setError("");

    try {

      const res = await api.post("/predictions/risk/", {
        animal_id: selectedAnimal,
        symptoms: symptoms
      });

      setResult(res.data);

    } catch (err) {

      console.log(err.response?.data);
      setError("Risk prediction failed");

    }

    setLoading(false);

  };

  const riskColor = (score) => {

    if (score > 70) return "bg-red-500";
    if (score > 40) return "bg-yellow-500";
    return "bg-green-500";

  };

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          AI Risk Prediction
        </h1>

        <p className="text-gray-500 text-sm">
          Preventive health risk assessment based on animal profile
        </p>

      </div>

      {/* SELECT ANIMAL */}

      <div className="bg-white p-6 rounded-2xl shadow mb-6">

        <label className="text-sm font-medium">
          Select Animal for Risk Assessment
        </label>

        <div className="flex gap-3 mt-2">

          <select
            value={selectedAnimal}
            onChange={(e) => setSelectedAnimal(e.target.value)}
            className="border p-3 rounded-lg flex-1"
          >

            <option value="">Select Animal</option>

            {animals.map((animal) => (

              <option key={animal.id} value={animal.id}>
                {animal.name} ({animal.species})
              </option>

            ))}

          </select>

          <button
            onClick={handleAnalyze}
            className="bg-orange-500 text-white px-6 rounded-lg hover:bg-orange-600"
          >
            Analyze Risk
          </button>

        </div>

        <textarea
          placeholder="Optional symptoms..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="border w-full mt-4 p-3 rounded-lg"
        />

      </div>

      {/* ERROR */}

      {error && (

        <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
          {error}
        </div>

      )}

      {/* LOADING */}

      {loading && (

        <div className="bg-blue-100 text-blue-600 p-3 rounded mb-4">
          Analyzing risk...
        </div>

      )}

      {/* RESULT */}

      {result && (

        <div className="space-y-6">

          {/* RISK SCORE CARD */}

          <div className="bg-white p-6 rounded-2xl shadow">

            <div className="flex justify-between items-center mb-3">

              <h2 className="text-lg font-semibold">
                Risk Assessment
              </h2>

              <span className="px-3 py-1 bg-yellow-200 text-yellow-800 text-sm rounded-full">
                {result.risk_level}
              </span>

            </div>

            <div className="flex justify-between text-sm mb-2">

              <span>Risk Score</span>

              <span>{result.risk_score}/100</span>

            </div>

            <div className="w-full bg-gray-200 h-3 rounded">

              <div
                className={`h-3 rounded ${riskColor(result.risk_score)}`}
                style={{ width: `${result.risk_score}%` }}
              />

            </div>

          </div>

          {/* SUMMARY */}

          {result.summary && (

            <div className="bg-yellow-50 p-5 rounded-xl">
              {result.summary}

            </div>

          )}

          {/* POSSIBLE DISEASES */}

          {result?.possible_diseases?.length > 0 && (

            <div className="bg-red-50 p-5 rounded-xl">

              <h3 className="font-semibold mb-3">
                Possible Future Diseases
              </h3>

              <div className="flex flex-wrap gap-2">

                {result.possible_diseases.map((d, i) => (

                  <span
                    key={i}
                    className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
                  >
                    {d}
                  </span>

                ))}

              </div>

            </div>

          )}

          {/* RISK FACTORS */}

          {result?.risk_factors?.length > 0 && (

            <div className="bg-orange-50 p-5 rounded-xl">

              <h3 className="font-semibold mb-3">
                Key Risk Factors
              </h3>

              <ul className="list-disc ml-6 text-sm">

                {result.risk_factors.map((f, i) => (

                  <li key={i}>{f}</li>

                ))}

              </ul>

            </div>

          )}

          {/* RECOMMENDATIONS */}

          {result?.recommendations?.length > 0 && (

            <div className="bg-green-50 p-5 rounded-xl">

              <h3 className="font-semibold mb-3">
                Preventive Recommendations
              </h3>

              <ul className="list-disc ml-6 text-sm">

                {result.recommendations.map((r, i) => (

                  <li key={i}>{r}</li>

                ))}

              </ul>

            </div>

          )}

          {/* EXTRA ADVICE */}

          <div className="grid md:grid-cols-2 gap-4">

            {result.vaccination_gap && (

              <div className="bg-blue-50 p-4 rounded-xl">

                <b>Vaccination Gaps</b>

                <p className="text-sm mt-1">
                  {result.vaccination_gap}
                </p>

              </div>

            )}

            {result.dietary_advice && (

              <div className="bg-purple-50 p-4 rounded-xl">

                <b>Dietary Advice</b>

                <p className="text-sm mt-1">
                  {result.dietary_advice}
                </p>

              </div>

            )}

          </div>

          {result.monitoring_advice && (

            <div className="bg-gray-100 p-4 rounded-xl">

              <b>Monitoring Advice</b>

              <p className="text-sm mt-1">
                {result.monitoring_advice}
              </p>

            </div>

          )}

          {result.next_checkup && (

            <div className="bg-green-100 p-4 rounded-xl">

              <b>Next Checkup</b>

              <p className="text-sm mt-1">
                {result.next_checkup}
              </p>

            </div>

          )}

        </div>

      )}

    </div>

  );

};

export default RiskPrediction;