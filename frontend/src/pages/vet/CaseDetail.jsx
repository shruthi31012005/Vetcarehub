import { useState, useEffect } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";

const CaseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    vet_diagnosis: "",
    treatment_plan: "",
    prescription: "",
    advice: "",
    follow_up_date: "",
    status: ""
  });

  useEffect(() => {
    api.get(`/cases/vet/${id}/`)
      .then(res => {
        setCaseData(res.data);
        setForm({
          vet_diagnosis: res.data.vet_diagnosis || "",
          treatment_plan: res.data.treatment_plan || "",
          prescription: res.data.prescription || "",
          advice: res.data.advice || "",
          follow_up_date: res.data.follow_up_date || "",
          status: res.data.status || ""
        });
      })
      .catch(() => setError("Failed to load case details"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/cases/vet/${id}/`, form);
      navigate("/vet/cases");
    } catch {
      setError("Failed to update case");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white p-8 rounded-xl shadow max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Case Detail</h2>
      <div className="mb-4">
        <div><b>Disease:</b> {caseData.predicted_disease}</div>
        <div><b>Animal:</b> {caseData.animal_name}</div>
        <div><b>Confidence:</b> {caseData.confidence}%</div>
        <div><b>Status:</b> {caseData.status}</div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Diagnosis</label>
          <textarea name="vet_diagnosis" value={form.vet_diagnosis} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Treatment Plan</label>
          <textarea name="treatment_plan" value={form.treatment_plan} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Prescription</label>
          <textarea name="prescription" value={form.prescription} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Advice to Owner</label>
          <textarea name="advice" value={form.advice} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Follow-up Date</label>
          <input type="date" name="follow_up_date" value={form.follow_up_date} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-semibold">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="w-full border p-2 rounded">
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
      </form>
    </div>
  );
};

export default CaseDetail;
