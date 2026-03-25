// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../services/api";
// import jsPDF from "jspdf";

// const PredictionDetail = () => {
//   const { id } = useParams();
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     api.get(`/predictions/vet/health-records/${id}/`)
//       .then(res => setData(res.data));
//   }, [id]);

//   const downloadPDF = () => {
//   const doc = new jsPDF("p", "mm", "a4");

//   let y = 15;

//   // Title
//   doc.setFontSize(18);
//   doc.setTextColor(0, 100, 0);
//   doc.text("AI Disease Prediction Report", 10, y);
//   y += 10;

//   doc.setFontSize(14);
//   doc.setTextColor(0, 0, 0);
//   doc.text(`Disease: ${data.predicted_disease}`, 10, y);
//   y += 8;

//   doc.text(`Severity: ${data.severity}`, 10, y);
//   y += 8;

//   doc.text(`Confidence: ${data.confidence}%`, 10, y);
//   y += 12;

//   const addSection = (title, content) => {
//     if (!content) return;

//     doc.setFontSize(13);
//     doc.setTextColor(0, 70, 140);
//     doc.text(title, 10, y);
//     y += 6;

//     doc.setFontSize(11);
//     doc.setTextColor(0, 0, 0);

//     const lines = doc.splitTextToSize(content, 180);
//     doc.text(lines, 10, y);
//     y += lines.length * 6 + 5;
//   };

//   addSection("Disease Description", data.description);
//   addSection("Symptoms Analysis", data.symptoms_analysis);
//   addSection("Recommended Treatment", data.recommended_treatment);
//   addSection("Suggested Medication", data.suggested_medication);
//   addSection("Prevention Tips", data.prevention_tips);
//   addSection("Additional Notes", data.additional_notes);
//   addSection("Immediate Home Care", data.home_care);

//   if (data.emergency) {
//     doc.setTextColor(200, 0, 0);
//     doc.setFontSize(12);
//     doc.text(
//       "EMERGENCY: Seek immediate veterinary assistance.",
//       10,
//       y
//     );
//     y += 10;
//   }

//   // Professional advisory
//   doc.setTextColor(80, 80, 80);
//   doc.setFontSize(10);
//   doc.text(
//     doc.splitTextToSize(
//       "Important: This AI analysis is designed to assist in early detection and awareness. It should not replace professional veterinary diagnosis. For accurate treatment planning and confirmation, please consult a licensed veterinarian.",
//       180
//     ),
//     10,
//     y
//   );

//   doc.save("AI_Health_Report.pdf");
// };

//   if (!data) return <div>Loading...</div>;

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">

//       <h1 className="text-2xl font-bold mb-4">
//         {data.predicted_disease}
//       </h1>

//       <div className="bg-white p-6 rounded-xl shadow mb-6">
//         <p><strong>Animal:</strong> {data.animal}</p>
//         <p><strong>Severity:</strong> {data.severity}</p>
//         <p><strong>Confidence:</strong> {data.confidence}%</p>
//       </div>

//       <button
//         onClick={downloadPDF}
//         className="bg-green-600 text-white px-4 py-2 rounded-lg"
//       >
//         Download PDF Report
//       </button>

//     </div>
//   );
// };

// export default PredictionDetail;