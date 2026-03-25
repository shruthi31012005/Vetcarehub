// import { useEffect, useState } from "react";
// import api from "../../services/api";
// import {
//   ComposableMap,
//   Geographies,
//   Geography
// } from "react-simple-maps";

// const geoUrl =
//   "https://raw.githubusercontent.com/deldersveld/topojson/master/countries/india/india-states.json";

// const RiskHeatmap = () => {

//   const [data, setData] = useState([]);

//   useEffect(() => {

//     api.get("/predictions/risk-heatmap/")
//       .then(res => setData(res.data))
//       .catch(err => console.log(err));

//   }, []);

//   const getColor = (region) => {

//     const item = data.find(r => r.region === region);

//     if (!item) return "#E5E7EB";

//     if (item.risk_level === "high") return "#EF4444";
//     if (item.risk_level === "medium") return "#F59E0B";

//     return "#10B981";
//   };

//   return (

//     <div className="p-6">

//       <h1 className="text-2xl font-bold mb-6">
//         Disease Outbreak Heatmap
//       </h1>

//       <ComposableMap>

//         <Geographies geography={geoUrl}>
//           {({ geographies }) =>
//             geographies.map(geo => {

//               const region = geo.properties.st_nm;

//               return (

//                 <Geography
//                   key={geo.rsmKey}
//                   geography={geo}
//                   fill={getColor(region)}
//                   stroke="#FFF"
//                 />

//               );

//             })
//           }
//         </Geographies>

//       </ComposableMap>

//     </div>

//   );
// };

// export default RiskHeatmap;