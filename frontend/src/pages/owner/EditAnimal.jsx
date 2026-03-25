import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../../services/api";

const EditAnimal = () => {

  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    age_years: "",
    age_months: "",
    weight: "",
    location: "",
    status: "",
    notes: "",
  });

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  /* Load animal */
  useEffect(() => {

    api.get(`/animals/${id}/`)
      .then((res) => setAnimal(res.data))
      .catch(() => alert("Failed to load animal"));

  }, [id]);



  const handleChange = (e) => {

    const { name, value } = e.target;

    setAnimal({
      ...animal,
      [name]: value
    });

  };


  const handleImageChange = (e) => {

    setImage(e.target.files[0]);

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);

    const formData = new FormData();

    formData.append("name", animal.name);
    formData.append("category", animal.category);
    formData.append("species", animal.species);
    formData.append("breed", animal.breed);
    formData.append("gender", animal.gender);
    formData.append("age_years", animal.age_years);
    formData.append("age_months", animal.age_months);
    formData.append("weight", animal.weight);
    formData.append("location", animal.location);
    formData.append("status", animal.status);
    formData.append("notes", animal.notes);

    if (image) {
      formData.append("image", image);
    }

    try {

      await api.patch(`/animals/${id}/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Animal updated successfully");

      navigate(`/owner/animal/${id}`);

    } catch (err) {

      console.log(err.response?.data);
      alert(JSON.stringify(err.response?.data) || "Update failed");
      // alert("Update failed");

    }

    setLoading(false);

  };



  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Edit {animal.name}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow max-w-2xl space-y-6"
      >

        {/* Image */}

        <div className="flex flex-col items-center">

          {animal.image && (
            <img
              src={`{animal.image}`}
              className="w-32 h-32 rounded-full object-cover mb-3"
            />
          )}

          <input type="file" onChange={handleImageChange} />

        </div>



        {/* Name + Species */}

        <div className="grid grid-cols-2 gap-4">

          <input
            name="name"
            value={animal.name}
            onChange={handleChange}
            placeholder="Animal Name"
            className="border p-3 rounded-lg"
          />

          <select
            name="category"
            value={animal.category}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Select Category</option>
            <option value="pet">Pet</option>
            <option value="livestock">Livestock</option>
            <option value="wild">Wild</option>
          </select>

          <select
            name="species"
            value={animal.species}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Animal Type</option>
            <option>dog</option>
            <option>cat</option>
            <option>cow</option>
            <option>horse</option>
          </select>

        </div>



        {/* Breed + Gender */}

        <div className="grid grid-cols-2 gap-4">

          <input
            name="breed"
            value={animal.breed}
            onChange={handleChange}
            placeholder="Breed"
            className="border p-3 rounded-lg"
          />

          <select
            name="gender"
            value={animal.gender}
            onChange={handleChange}
            className="border p-3 rounded-lg"
          >
            <option value="">Gender</option>
            <option>male</option>
            <option>female</option>
          </select>

        </div>



        {/* Age */}

        <div className="grid grid-cols-3 gap-4">
          <input
            name="age_years"
            value={animal.age_years}
            onChange={handleChange}
            placeholder="Age (Years)"
            className="border p-3 rounded-lg"
          />

          <input
            name="age_months"
            value={animal.age_months}
            onChange={handleChange}
            placeholder="Age (Months)"
            className="border p-3 rounded-lg"
          />

          <input
            name="weight"
            value={animal.weight}
            onChange={handleChange}
            placeholder="Weight (kg)"
            className="border p-3 rounded-lg"
          />

        </div>



        {/* Location */}

        <input
          name="location"
          value={animal.location}
          onChange={handleChange}
          placeholder="Location"
          className="border p-3 rounded-lg w-full"
        />



        {/* Health Status */}

        <select
          name="status"
          value={animal.status}
          onChange={handleChange}
          className="border p-3 rounded-lg w-full"
        >
          <option value="">Health Status</option>
          <option>healthy</option>
          <option>under observation</option>
          <option>sick</option>
          <option>critical</option>
        </select>



        {/* Notes */}

        <textarea
          name="notes"
          value={animal.notes}
          onChange={handleChange}
          placeholder="Additional Notes"
          className="border p-3 rounded-lg w-full"
        />



        {/* Buttons */}

        <div className="flex gap-4">

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="border px-6 py-3 rounded-lg"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default EditAnimal;