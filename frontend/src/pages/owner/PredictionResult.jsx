import { useLocation, useNavigate } from "react-router-dom";

const PredictionResult = () => {

  const { state } = useLocation();
  const navigate = useNavigate();

  const result = state?.result;

  if (!result) {
    return <div className="p-6">No prediction data found.</div>;
  }

  const primary = result.primary_prediction;
  const topPredictions = result.top_predictions || [];
  const warning = result.warning;

  const formatText = (text) => {
    if (!text) return "";
    return text.split("\n").map((line, index) => (
      <p key={index} className="mb-2">{line}</p>
    ));
  };

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER CARD */}
      <div className="bg-white rounded-2xl shadow border-t-4 border-orange-500 p-6 mb-6">

        <div className="flex justify-between items-start flex-wrap gap-3">

          <div>
            <h1 className="text-xl md:text-2xl font-bold">
              {result.predicted_disease}
            </h1>

            <p className="text-gray-500 text-sm mt-1">
              AI Diagnosis Result
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">

            <span className="px-3 py-1 bg-orange-100 text-orange-600 text-xs rounded-full">
              {result.severity} Severity
            </span>

            {result.emergency && (
              <span className="px-3 py-1 bg-red-100 text-red-600 text-xs rounded-full">
                Vet Needed
              </span>
            )}

          </div>

        </div>

        {/* Confidence */}

        <div className="mt-6">

          <div className="flex justify-between text-sm mb-2">
            <span>Confidence Score</span>
            <span>{result.confidence}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">

            <div
              className="bg-gray-800 h-2 rounded-full transition-all duration-700"
              style={{ width: `${result.confidence || 0}%` }}
            />

          </div>

        </div>

      </div>

      {/* TOP 3 DISEASES */}

      {topPredictions.length > 0 && (

        <div className="bg-white p-5 rounded-xl shadow mb-6">

          <h3 className="font-semibold mb-3">
            Other Possible Diseases
          </h3>

          {topPredictions.map((d, index) => (

            <div
              key={index}
              className="flex justify-between border-b py-2 text-sm"
            >

              <span>{index + 1}. {d.name}</span>

              <span>{d.confidence}%</span>

            </div>

          ))}

        </div>

      )}

      {/* WARNING */}

      {warning && (

        <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 p-4 rounded-xl mb-6 text-sm">

          ⚠️ {warning}

        </div>

      )}

      {/* DESCRIPTION */}

      <div className="bg-gray-100 p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Disease Description
        </h3>

        <div className="text-gray-700 text-sm">
          {formatText(result.description)}
        </div>

      </div>

      {/* SYMPTOMS ANALYSIS */}

      <div className="bg-blue-50 p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Symptoms Analysis
        </h3>

        <div className="text-sm text-gray-700">
          {formatText(result.symptoms_analysis)}
        </div>

      </div>

      {/* TREATMENT + MEDICATION */}

      <div className="grid md:grid-cols-2 gap-4 mb-4">

        <div className="bg-green-50 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            Recommended Treatment
          </h3>

          <div className="text-sm text-gray-700">
            {formatText(result.recommended_treatment)}
          </div>

        </div>

        <div className="bg-purple-50 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            Suggested Medication
          </h3>

          <div className="text-sm text-gray-700">
            {formatText(result.suggested_medication)}
          </div>

        </div>

      </div>
{/* PREVENTION */}

      <div className="bg-yellow-50 p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Prevention Tips
        </h3>

        <div className="text-sm text-gray-700">
          {formatText(result.prevention_tips)}
        </div>

      </div>

      {/* BUTTONS */}

      <div className="flex justify-between gap-4">

        <button
          onClick={() => navigate("/owner/disease-prediction")}
          className="flex-1 border py-3 rounded-xl"
        >
          New Analysis
        </button>

        <button
          onClick={() => navigate("/owner/health-records")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          View Health Records →
        </button>

      </div>

    </div>

  );

};

export default PredictionResult;
