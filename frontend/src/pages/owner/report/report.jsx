import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import api from "../../../services/api";

const Report = () => {

  const { animal_id } = useParams();

  const generate = async () => {

    const res = await api.get(`/animals/dashboard/${animal_id}/`);

    const data = res.data;

    const doc = new jsPDF();

    let y = 20;

    // Title
    doc.setFontSize(20);
    doc.text("VetCare Hub", 20, y);

    y += 10;

    doc.setFontSize(14);
    doc.text(`Health Report - ${data.animal.name}`, 20, y);

    y += 15;

    // Animal Information
    doc.setFontSize(12);
    doc.text("Animal Information", 20, y);

    y += 10;

    doc.text(`Species: ${data.animal.species}`, 20, y);
    y += 8;

    doc.text(`Breed: ${data.animal.breed}`, 20, y);
    y += 8;

    doc.text(`Gender: ${data.animal.gender}`, 20, y);
    y += 8;

    doc.text(
      `Age: ${data.animal.age_years}y ${data.animal.age_months}m`,
      20,
      y
    );
    y += 8;

    doc.text(`Weight: ${data.animal.weight} kg`, 20, y);

    y += 15;

    // Risk Section
    doc.setFontSize(12);
    doc.text("Risk Assessment", 20, y);

    y += 10;

    doc.text(`Risk Level: ${data.risk_level}`, 20, y);

    y += 15;

    // Disease Predictions
    doc.text("Health Records / AI Predictions", 20, y);

    y += 10;

    if (data.records.length === 0) {
      doc.text("No AI diagnosis records found.", 20, y);
      y += 10;
    } else {

      data.records.forEach((record) => {

        doc.text(`Disease: ${record.disease || "Unknown"}`, 20, y);
        y += 8;

        doc.text(`Confidence: ${record.confidence || "N/A"}%`, 20, y);
        y += 8;

        doc.text(
          `Date: ${new Date(record.date).toLocaleDateString()}`,
          20,
          y
        );

        y += 12;

      });

    }

    // Vaccinations
    doc.text("Vaccination History", 20, y);

    y += 10;

    if (data.vaccinations.length === 0) {
      doc.text("No vaccination records found.", 20, y);
    } else {

      data.vaccinations.forEach((v) => {

        doc.text(`${v.name} - ${v.status}`, 20, y);

        y += 8;

        doc.text(
          `Date: ${new Date(v.date).toLocaleDateString()}`,
          20,
          y
        );

        y += 10;

      });

    }

    y += 10;

    // Preventive Advice
    doc.text("Preventive Care Recommendation", 20, y);

    y += 10;

    doc.text(
      "Regular veterinary check-ups and vaccination schedules are recommended to maintain optimal health and prevent disease outbreaks.",
      20,
      y,
      { maxWidth: 170 }
    );

    doc.save(`${data.animal.name}_health_report.pdf`);

  };

  return (

    <div className="p-6">

      <button
        onClick={generate}
        className="bg-green-600 text-white px-6 py-3 rounded-lg shadow"
      >
        Generate Report
      </button>

    </div>

  );

};

export default Report;