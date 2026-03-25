import { useState, useEffect } from "react";
import api from "../../services/api";

const BookAppointment = () => {
  const [animals, setAnimals] = useState([]);
  const [animal, setAnimal] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch(() => setError("Failed to load animals"));
  }, []);

  const handleBook = async () => {
    if (!animal || !date || !time || !reason) {
      alert("Please fill all required fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/appointments/book/", {
        animal_id: animal,
        date,
        time,
        reason,
      });
      setSuccess(true);
      setAnimal("");
      setDate("");
      setTime("");
      setReason("");
    } catch (err) {
      setError("Booking failed");
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Book an Appointment</h2>
      <input
        type="text"
        placeholder="Animal"
        value={animal}
        onChange={(e) => setAnimal(e.target.value)}
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <input
        type="text"
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button onClick={handleBook} disabled={loading}>
        {loading ? "Loading..." : "Book Appointment"}
      </button>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </div>
  );
};

export default BookAppointment;