import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const DiseasePrediction = () => {

  const navigate = useNavigate();

  const [animals, setAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState("");

  const [species, setSpecies] = useState("");
  const [category, setCategory] = useState("");

  const [symptoms, setSymptoms] = useState("");

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  // Load animals
  useEffect(() => {

    api.get("/animals/")
      .then((res) => setAnimals(res.data))
      .catch((err) => console.log(err));

  }, []);

  // Image upload handler
  const handleImageChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));

  };

  // Submit prediction
  const handleAnalyze = async () => {

    if (!symptoms) {
      alert("Please describe symptoms");
      return;
    }

    if (!selectedAnimal && !species) {
      alert("Please select an animal or enter species");
      return;
    }

    setLoading(true);

    const formData = new FormData();

    if (selectedAnimal) {

      formData.append("animal_id", selectedAnimal);

    } else {

      formData.append("species", species);
      formData.append("category", category);

    }

    formData.append("symptoms", symptoms);

    if (image) {
      formData.append("image", image);
    }

    try {

      const endpoint = selectedAnimal
        ? "/predictions/predict/"
        : "/predictions/quick/";

      const res = await api.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/owner/prediction-result", {
        state: { result: res.data }
      });

    } catch (err) {

      console.log(err.response?.data);
      alert("Prediction failed");

    }

    setLoading(false);

  };

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="flex items-center gap-3 mb-6">

        <div className="bg-green-100 p-3 rounded-xl text-green-600 text-xl">
          🩺
        </div>

        <div>

          <h1 className="text-2xl font-bold">
            AI Disease Prediction
          </h1>

          <p className="text-gray-500">
            Get instant AI-powered health analysis for your animals
          </p>

        </div>

      </div>

      {/* SELECT ANIMAL */}

      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <h2 className="font-semibold mb-4 text-green-600">
          Select Animal
        </h2>

        <label className="block text-sm mb-2">
          Select a registered animal
        </label>

        <select
          value={selectedAnimal}
          onChange={(e) => setSelectedAnimal(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        >

          <option value="">Choose a registered animal</option>

          {animals.map((animal) => (

            <option key={animal.id} value={animal.id}>
              {animal.name}
            </option>

          ))}

        </select>

        <div className="text-center text-gray-400 text-sm mb-4">
          or analyze any creature
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Species / Creature"
            value={species}
            disabled={selectedAnimal !== ""}
            onChange={(e) => setSpecies(e.target.value)}
            className="border p-3 rounded-lg"
          />

          <select
            value={category}
            disabled={selectedAnimal !== ""}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-3 rounded-lg"
          >
            <option value="">Select category</option>
            <option>Livestock</option>
            <option>Pets</option>
            <option>Poultry</option>
            <option>Wild</option>

          </select>

        </div>

      </div>

      {/* SYMPTOMS */}

      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <h2 className="font-semibold mb-4 text-green-600">
          Describe Symptoms
        </h2>

        <textarea
          rows="5"
          placeholder="Describe all symptoms in detail..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          className="w-full border p-3 rounded-lg"
        />

        <p className="text-xs text-gray-400 mt-2">
          Be as detailed as possible for better diagnosis accuracy
        </p>

      </div>

      {/* IMAGE UPLOAD */}

      <div className="bg-white rounded-2xl shadow p-6 mb-6">

        <h2 className="font-semibold mb-4 text-green-600">
          Upload Image (Optional)
        </h2>

        <label className="border-2 border-dashed border-green-300 rounded-xl p-10 text-center block cursor-pointer hover:bg-green-50 transition">

          <input
            type="file"
            className="hidden"
            onChange={handleImageChange}
          />

          <div className="text-green-500 text-3xl mb-2">
            ⬆️
          </div>

          <p className="text-gray-500">
            Click to upload an image
          </p>

          <p className="text-xs text-gray-400">
            Helps AI provide better analysis
          </p>

        </label>

        {preview && (

          <img
            src={preview}
            alt="preview"
            className="mt-4 w-32 h-32 object-cover rounded-lg mx-auto"
          />

        )}

      </div>

      {/* ANALYZE BUTTON */}

      <button
        onClick={handleAnalyze}
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition"
      >

        {loading ? "Analyzing..." : "Analyze Symptoms"}

      </button>

    </div>

  );
};

export default DiseasePrediction;