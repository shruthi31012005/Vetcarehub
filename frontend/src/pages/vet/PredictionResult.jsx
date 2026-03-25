import { useLocation, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const PredictionResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const result = state?.result;

  if (!result) {
    return <div className="p-6">No prediction data found.</div>;
  }

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
              style={{ width: `${result.confidence}% `}}
            />
          </div>

        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="bg-gray-100 p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Disease Description
        </h3>

        <div className="text-gray-700 text-sm">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result.description}
          </ReactMarkdown>
        </div>

      </div>

      {/* SYMPTOMS ANALYSIS */}
      <div className="bg-blue-50 p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Symptoms Analysis
        </h3>

        <div className="text-sm text-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result.symptoms_analysis}
          </ReactMarkdown>
        </div>

      </div>

      {/* TREATMENT & MEDICATION GRID */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">

        <div className="bg-green-50 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            Recommended Treatment
          </h3>

          <div className="text-sm text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.recommended_treatment}
            </ReactMarkdown>
          </div>

        </div>

        <div className="bg-purple-50 p-5 rounded-xl">

          <h3 className="font-semibold mb-2">
            Suggested Medication
          </h3>

          <div className="text-sm text-gray-700">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {result.suggested_medication}
            </ReactMarkdown>
          </div>

        </div>

      </div>

      {/* PREVENTION */}
      <div className="bg-yellow-50 p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Prevention Tips
        </h3>

        <div className="text-sm text-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result.prevention_tips}
          </ReactMarkdown>
        </div>

      </div>

      {/* ADDITIONAL NOTES */}
      <div className="bg-white border p-5 rounded-xl mb-4">

        <h3 className="font-semibold mb-2">
          Additional Notes
        </h3>
        <div className="text-sm text-gray-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {result.additional_notes}
          </ReactMarkdown>
        </div>

      </div>

      {/* EMERGENCY SECTION */}
      {result.emergency && (
        <div className="bg-red-100 border border-red-200 p-5 rounded-xl mb-4 text-red-700 text-sm font-medium">
          🚨 EMERGENCY – Seek Immediate Help  
          The symptoms indicate a potentially serious condition. Immediate veterinary
          consultation is strongly advised.
        </div>
      )}

      {/* PROFESSIONAL DISCLAIMER */}
      <div className="bg-gray-100 p-5 rounded-xl mb-6 text-sm text-gray-600">
        ⚠️ <strong>Important:</strong>  
        This AI analysis is designed to assist in early detection and awareness.  
        It should not replace professional veterinary diagnosis.  
        For accurate treatment planning and confirmation, please consult a licensed veterinarian.
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between gap-4">

        <button
          onClick={() => navigate("/vet/ai")}
          className="flex-1 border py-3 rounded-xl"
        >
          New Analysis
        </button>

        <button
          onClick={() => navigate("/vet/health-records")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          View Health Records →
        </button>

      </div>

    </div>
  );
};

export default PredictionResult;