import { useEffect, useState } from "react";
import api from "../../services/api";

const Vaccinations = () => {

  const [vaccines, setVaccines] = useState([]);

  useEffect(() => {

    api.get("/vaccinations/vet/")
      .then(res => setVaccines(res.data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-bold mb-6">
        Vaccination Schedule
      </h1>

      <div className="space-y-4">

        {vaccines.map(v => (

          <div
            key={v.id}
            className="bg-white p-4 rounded-xl shadow flex justify-between"
          >

            <div>

              <h3 className="font-semibold">
                {v.vaccine_name}
              </h3>

              <p className="text-sm text-gray-500">
                Animal: {v.animal}
              </p>

              <p className="text-sm text-gray-400">
                Date: {v.next_due_date}
              </p>

            </div>

            <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
              {v.status}
            </span>

          </div>

        ))}

      </div>

    </div>

  );

};

export default Vaccinations;