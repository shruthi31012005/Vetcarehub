import { useEffect, useState } from "react";
import api from "../../services/api";

import {
  ComposableMap,
  Geographies,
  Geography
} from "react-simple-maps";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const geoUrl =
"https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

const GlobalOutbreakDashboard = () => {

  const [data, setData] = useState(null);

  useEffect(() => {

    api.get("/predictions/global-outbreak/")
      .then((res) => setData(res.data))
      .catch(() => console.log("Failed to load outbreak data"));

  }, []);

  if (!data) {

    return (
      <div className="p-6">
        Loading outbreak intelligence...
      </div>
    );

  }

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}

      <div className="mb-6">

        <h1 className="text-2xl font-bold">
          Global Animal Disease Intelligence
        </h1>

        <p className="text-gray-500">
          AI powered worldwide outbreak monitoring
        </p>

      </div>

      {/* STAT CARDS */}

      <div className="grid md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white p-5 rounded-xl shadow">

          <h3 className="text-sm text-gray-500">
            Active Outbreaks
          </h3>

          <p className="text-2xl font-bold">
            {data.active_outbreaks}
          </p>

        </div>

        <div className="bg-white p-5 rounded-xl shadow">

          <h3 className="text-sm text-gray-500">
            High Risk Regions
          </h3>

          <p className="text-2xl font-bold">
            {data.high_risk_regions}
          </p>

        </div>

        <div className="bg-white p-5 rounded-xl shadow">

          <h3 className="text-sm text-gray-500">
            Emerging Diseases
          </h3>

          <p className="text-2xl font-bold">
            {data.emerging_diseases}
          </p>

        </div>

      </div>

      {/* WORLD MAP */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h3 className="font-semibold mb-4">
          Global Outbreak Heatmap
        </h3>

        <ComposableMap>

          <Geographies geography={geoUrl}>

            {({ geographies }) =>
              geographies.map((geo) => {

                const risk =
                  data.region_risk[geo.properties.name];

                let fill = "#E5E7EB";

                if (risk === "high") fill = "#F87171";
                if (risk === "medium") fill = "#FACC15";
                if (risk === "low") fill = "#34D399";

                return (

                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { fill, outline: "none" },
                      hover: { fill: "#6366F1", outline: "none" }
                    }}
                  />

                );

              })
            }

          </Geographies>

        </ComposableMap>

      </div>

      {/* OUTBREAK TREND */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <h3 className="font-semibold mb-4">
          Global Outbreak Trend
        </h3>

        <ResponsiveContainer width="100%" height={300}>

          <LineChart data={data.trend}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="cases"
              stroke="#ef4444"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* HIGH RISK DISEASES */}

      <div className="bg-white p-6 rounded-xl shadow">

        <h3 className="font-semibold mb-4">
          High Risk Animal Diseases
        </h3>

        <div className="flex flex-wrap gap-2">

          {data.high_risk_diseases.map((disease, index) => (

            <span
              key={index}
              className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm"
            >
            {disease}

            </span>

          ))}

        </div>

      </div>

    </div>

  );

};

export default GlobalOutbreakDashboard;