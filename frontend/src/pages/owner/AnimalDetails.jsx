
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import jsPDF from "jspdf";
import { Trash2, Pencil } from "lucide-react";

const AnimalDetails = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tab, setTab] = useState("records");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Delete handler
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this animal?")) return;
    try {
      await api.delete(`/animals/${data.animal.id}/`);
      alert("Animal deleted successfully");
      navigate("/owner/animals");
    } catch {
      alert("Failed to delete animal");
    }
  };


  useEffect(() => {
    setLoading(true);
    api.get(`/animals/dashboard/${id}/`)
      .then(res => setData(res.data))
      .catch(() => setError("Failed to load animal details"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!data) return <div className="p-6">No data found</div>;

  const animal = data.animal;
  const records = data.records || [];
  const vaccinations = data.vaccinations || [];



  /* ----------------------------
     PDF REPORT
  -----------------------------*/

  const generatePDF = () => {

    const doc = new jsPDF();

    let y = 20;

    doc.setFontSize(18);
    doc.setTextColor(0,120,70);
    doc.text("VetCare Hub", 10, y);

    y += 10;

    doc.setFontSize(14);
    doc.text(`Health Report - ${animal.name}`, 10, y);

    y += 10;

    doc.setTextColor(0,0,0);

    doc.text(`Species: ${animal.species}`, 10, y); y+=6;
    doc.text(`Breed: ${animal.breed}`, 10, y); y+=6;
    doc.text(`Gender: ${animal.gender}`, 10, y); y+=6;
    doc.text(`Age: ${animal.age_years}y ${animal.age_months}m`, 10, y); y+=6;
    doc.text(`Weight: ${animal.weight} kg`, 10, y); y+=10;


    /* Predictions */

    doc.setFontSize(14);
    doc.setTextColor(0,120,70);
    doc.text("Disease Predictions",10,y);
    y+=8;

    doc.setTextColor(0,0,0);

    records.forEach(r => {

      doc.text(`Disease: ${r.disease}`, 10, y); y+=6;
      doc.text(`Confidence: ${r.confidence}%`, 10, y); y+=6;
      doc.text(`Date: ${new Date(r.date).toLocaleDateString()}`, 10, y); y+=8;

    });


    /* Vaccinations */

    doc.setFontSize(14);
    doc.setTextColor(0,120,70);
    doc.text("Vaccinations",10,y);
    y+=8;

    doc.setTextColor(0,0,0);

    vaccinations.forEach(v => {

      doc.text(`${v.name} - ${v.status}`, 10, y); y+=6;

    });

    doc.save(`${animal.name}_report.pdf`);

  };




  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER + ACTIONS */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold mb-1">{animal.name}</h1>
          <p className="text-gray-500 text-lg">{animal.species} • {animal.breed}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/owner/edit-animal/${animal.id}`)}
            className="flex items-center gap-1 border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <Pencil size={18} /> Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1 border px-4 py-2 rounded-lg text-red-500 hover:bg-red-50"
          >
            <Trash2 size={18} /> Delete
          </button>
        </div>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <div className="h-28 bg-gradient-to-r from-green-500 to-green-700"></div>
        <div className="p-6 flex gap-6 -mt-16 items-center">
          <img
            src={animal.image ? `http://127.0.0.1:8000${animal.image}` : "/default-animal.png"}
            className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg bg-white"
            alt={animal.name}
          />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 mb-2">
              <span className="bg-purple-100 text-purple-600 px-2 py-1 rounded text-xs font-semibold uppercase">{animal.status}</span>
              <span className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold uppercase">pet</span>
              <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded text-xs font-semibold uppercase">{animal.gender}</span>
            </div>
            <div className="flex gap-8 mt-2">
              <div>
                <p className="text-gray-400 text-xs">Age</p>
                <p className="font-bold text-lg">{animal.age_years}y {animal.age_months}m</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Weight</p>
                <p className="font-bold text-lg">{animal.weight} kg</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Location</p>
                <p className="font-bold text-lg">{animal.location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RISK SECTION */}
      <div className="bg-yellow-50 border rounded-xl p-4 mb-6 flex justify-between items-center">
        <div>
          <b>AI Risk Level: <span className="text-yellow-700">{data.risk_level}</span></b>
          {data.risk_level && data.risk_level !== "Unknown" && (
            <p className="text-sm text-gray-600 mt-1">{data.risk_diseases || ""}</p>
          )}
        </div>
        <button
          onClick={() => navigate(`/owner/risk-prediction?animal_id=${animal.id}`)}
          className="border px-3 py-1 rounded hover:bg-yellow-100"
        >
          View Details
        </button>
      </div>

      {/* ACTION CARDS */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div
          onClick={() => navigate(`/owner/disease-prediction?animal_id=${animal.id}`)}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <b className="block mb-1">AI Analysis</b>
          <p className="text-sm text-gray-500">Check health</p>
        </div>
        <div
          onClick={() => navigate(`/owner/vaccinations?animal_id=${animal.id}`)}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <b className="block mb-1">Vaccines</b>
          <p className="text-sm text-gray-500">{vaccinations.length} records</p>
        </div>
        <div
          onClick={() => navigate(`/owner/health-records?animal_id=${animal.id}`)}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <b className="block mb-1">Records</b>
          <p className="text-sm text-gray-500">{records.length} entries</p>
        </div>
        <div
          onClick={generatePDF}
          className="bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-green-50"
        >
          <b className="block mb-1">Report</b>
          <p className="text-sm text-gray-500">Generate PDF</p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-2 border-b mb-4">
        <button
          onClick={() => setTab("records")}
          className={`px-4 py-2 rounded-t ${tab === "records" ? "bg-white border-x border-t border-b-0 font-semibold" : "bg-gray-100 text-gray-500"}`}
        >
          Health Records
        </button>
        <button
          onClick={() => setTab("vaccinations")}
          className={`px-4 py-2 rounded-t ${tab === "vaccinations" ? "bg-white border-x border-t border-b-0 font-semibold" : "bg-gray-100 text-gray-500"}`}
        >
          Vaccinations
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="bg-white rounded-b-xl shadow p-6">
        {tab === "records" && (
          <div>
            {records.length === 0 ? (
              <div className="text-gray-500">No health records</div>
            ) : (
              records.map(record => (
                <div key={record.id} className="bg-gray-50 p-4 rounded-lg mb-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold">{record.disease || "Unknown"}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">AI predicted disease based on symptoms</p>
                  <div className="flex gap-6 text-xs text-gray-500">
                    <span>Confidence: {record.confidence}%</span>
                    <span>Date: {new Date(record.date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {tab === "vaccinations" && (
          <div>
            {vaccinations.length === 0 ? (
              <div className="text-gray-500">No vaccination records</div>
            ) : (
              vaccinations.map(v => (
                <div key={v.name} className="bg-gray-50 p-4 rounded-lg mb-3 flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-base">{v.name}</span>
                    </div>
                    <p className="text-sm text-gray-500">{v.date ? new Date(v.date).toLocaleDateString() : "No date"}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${v.status === "completed" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-700"}`}>{v.status}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );

};

export default AnimalDetails;
