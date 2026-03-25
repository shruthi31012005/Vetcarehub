import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const AddAnimal = () => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    species: "",
    breed: "",
    gender: "",
    ageYears: "",
    ageMonths: "",
    weight: "",
    location: "",
    status: "healthy",
    notes: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {

      setFormData({
        ...formData,
        [name]: files[0],
      });

      setPreview(URL.createObjectURL(files[0]));

    } else {

      setFormData({
        ...formData,
        [name]: value,
      });

    }
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {

      const data = new FormData();

      data.append("name", formData.name);
      data.append("category", formData.category);
      data.append("species", formData.species);
      data.append("breed", formData.breed);
      data.append("gender", formData.gender);
      data.append("age_years", Number(formData.ageYears||0));
      data.append("age_months", Number(formData.ageMonths||0));
      data.append("weight", Number(formData.weight));
      data.append("location", formData.location);
      data.append("status", formData.status);
      data.append("notes", formData.notes);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await api.post("/animals/", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      navigate("/owner/animals");

    } catch (err) {

      console.log(err.response?.data);
      setError("Failed to save animal");

    }

    setLoading(false);

  };

  return (

    <div className="p-8 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">

        <button
          onClick={() => navigate(-1)}
          className="text-gray-500"
        >
          ←
        </button>

        <div>
          <h1 className="text-2xl font-bold">
            Add New Animal
          </h1>

          <p className="text-gray-500 text-sm">
            Enter your animal's details
          </p>
        </div>

      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* IMAGE UPLOAD */}
        <div className="bg-white p-8 rounded-2xl shadow text-center">

          {preview ? (
            <img
              src={preview}
              alt="Animal preview"
              className="w-24 h-24 rounded-full object-cover mx-auto"
            />
          ) : (
            <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center text-3xl text-green-600">
              🐾
            </div>
          )}

          <p className="text-gray-500 mt-3">
            Upload a photo of your animal
          </p>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="mt-4"
          />

        </div>

        {/* BASIC INFO */}
        <div className="bg-white p-8 rounded-2xl shadow">

          <h2 className="font-semibold mb-6">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <input
              type="text"
              name="name"
              placeholder="Animal Name"
              value={formData.name}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            />

            <select
              name="category"
value={formData.category}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
            >
              <option value="">Select category</option>
              <option value="livestock">Livestock</option>
              <option value="pets">Pets</option>
              <option value="poultry">Poultry</option>
              <option value="wild">Wild</option>
              <option value="aquatic">Aquatic</option>
              <option value="bird">Bird</option>
              <option value="insect">Insect</option>
              <option value="other">Other</option>
            </select>

            <select
              name="species"
              value={formData.species}
              onChange={handleChange}
              className="border p-3 rounded-lg"
              required
              >
              <option value="">Select Species</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="cow">Cow</option>
              <option value="goat">Goat</option>
              <option value="poultry">Poultry</option>
              <option value="aquatic">Aquatic</option>
              <option value="wild">Wild</option>
              <option value="bird">Bird</option>
              <option value="insect">Insect</option>
              <option value="other">Other</option>
            </select> 

            <input
              type="text"
              name="breed"
              placeholder="Breed / Subspecies"
              value={formData.breed}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <div className="grid grid-cols-3 gap-4 col-span-2">

              <input
                type="number"
                name="ageYears"
                placeholder="Age (Years)"
                value={formData.ageYears}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                name="ageMonths"
                placeholder="Age (Months)"
                value={formData.ageMonths}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />

              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleChange}
                className="border p-3 rounded-lg"
              />

            </div>

          </div>

        </div>

        {/* LOCATION & HEALTH */}
        <div className="bg-white p-8 rounded-2xl shadow">

          <h2 className="font-semibold mb-6">
            Location & Health
          </h2>

          <div className="grid grid-cols-2 gap-6">

            <input
              type="text"
              name="location"
              placeholder="Location / Address"
              value={formData.location}
              onChange={handleChange}
              className="border p-3 rounded-lg col-span-2"
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-3 rounded-lg"
            >
              <option value="healthy">Healthy</option>
              <option value="sick">Sick</option>
              <option value="critical">Critical</option>
            </select>

            <textarea
              name="notes"
              placeholder="Additional Notes"
              value={formData.notes}
              onChange={handleChange}
              className="border p-3 rounded-lg col-span-2"
              rows="3"
            />

          </div>

        </div>

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            {loading ? "Saving..." : "Save Animal"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default AddAnimal;