import { useNavigate } from "react-router-dom";
import { Mail, Lock, PawPrint } from "lucide-react";
import { useState } from "react";
import api, { setAuthToken } from "../services/api";

const Login = () => {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");
const [error,setError] = useState("");

const handleLogin = async (e)=>{

e.preventDefault();
setError("");

try{

const res = await api.post("/users/login/",{
username:email,
password:password
});

const {access,refresh,role} = res.data;

localStorage.setItem("access",access);
localStorage.setItem("refresh",refresh);
localStorage.setItem("userRole",role);

setAuthToken(access);

navigate(`/${role}`);

}catch{
setError("Invalid credentials");
}

};

return(

<div className="min-h-screen flex">


{/* LEFT IMAGE */}

<div className="hidden lg:flex w-1/2 relative">

<img
src="https://images.unsplash.com/photo-1535930749574-1399327ce78f"
className="absolute inset-0 w-full h-full object-cover"
/>

<div className="absolute inset-0 bg-white/60"></div>

<div className="relative z-10 flex flex-col justify-center items-center text-center px-16">

<PawPrint size={48} className="text-green-600 mb-6"/>

<h1 className="text-3xl font-bold">
VetCare Hub
</h1>

<p className="mt-4 text-gray-700">
AI platform for animal disease prediction
and veterinary care.
</p>

</div>

</div>


{/* LOGIN CARD */}

<div className="flex flex-1 items-center justify-center bg-gray-50">

<div className="w-[420px] bg-white p-10 rounded-2xl shadow-xl">

<div className="text-center mb-6">

<div className="w-16 h-16 mx-auto bg-green-600 text-white rounded-full flex items-center justify-center mb-4">
<PawPrint/>
</div>

<h2 className="text-2xl font-bold">
Sign in
</h2>

</div>

{error &&(
<p className="text-red-500 text-center mb-4">{error}</p>
)}

<form onSubmit={handleLogin} className="space-y-4">

<div className="relative">

<Mail size={18} className="absolute top-3 left-3 text-gray-400"/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50"
required
/>

</div>


<div className="relative">

<Lock size={18} className="absolute top-3 left-3 text-gray-400"/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50"
required
/>

</div>

<button
type="submit"
className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-500"
>
Sign In
</button>

</form>

<div className="text-sm text-center mt-6">

<span
className="text-green-600 cursor-pointer"
onClick={()=>navigate("/signup")}
>
Create account
</span>

</div>

</div>

</div>

</div>

)

}

export default Login;

// import { useNavigate } from "react-router-dom";
// import { Mail, Lock, PawPrint } from "lucide-react";
// import { useState } from "react";
// import api, { setAuthToken } from "../services/api";

// const Login = () => {

//   const navigate = useNavigate();

//   const [email,setEmail] = useState("");
//   const [password,setPassword] = useState("");
//   const [error,setError] = useState("");

//   const handleLogin = async (e) => {

//     e.preventDefault();
//     setError("");

//     try {

//       const res = await api.post("/users/login/",{
//         username: email,
//         password: password,
//       });

//       const { access, refresh, role } = res.data;

//       localStorage.setItem("access",access);
//       localStorage.setItem("refresh",refresh);
//       localStorage.setItem("userRole",role);

//       setAuthToken(access);

//       navigate(`/${role}`);

//     } catch {

//       setError("Invalid credentials");

//     }

//   };

//   return (

// <div className="min-h-screen flex">

// {/* LEFT SIDE VISUAL */}

// <div className="hidden lg:flex w-1/2 relative bg-black">

// <img
// src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e"
// className="absolute inset-0 w-full h-full object-cover opacity-60"
// />

// <div className="relative z-10 flex flex-col justify-center items-center text-center px-16 text-white">

// <PawPrint size={48} className="text-green-400 mb-6"/>

// <h1 className="text-4xl font-bold">
// Welcome to VetCare Hub
// </h1>

// <p className="mt-6 text-gray-200">
// AI Powered platform for disease prediction,
// vaccination tracking and animal health monitoring.
// </p>

// </div>

// </div>


// {/* RIGHT SIDE LOGIN */}

// <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-black dark:to-gray-900 px-6">

// <div className="w-full max-w-md bg-white/80 dark:bg-black/60 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-200 dark:border-white/10">

// <div className="text-center mb-8">

// <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center text-white mb-4">
// <PawPrint size={24}/>
// </div>

// <h2 className="text-2xl font-bold">
// Sign in to VetCare Hub
// </h2>

// <p className="text-gray-500 mt-2">
// Access your animal healthcare dashboard
// </p>

// </div>


// {/* ERROR */}

// {error && (

// <p className="text-red-500 text-sm mb-4 text-center">
// {error}
// </p>

// )}


// {/* FORM */}

// <form onSubmit={handleLogin} className="space-y-5">


// {/* EMAIL */}

// <div className="relative">

// <Mail size={18} className="absolute top-3 left-3 text-gray-400"/>

// <input
// type="email"
// placeholder="Email address"
// value={email}
// onChange={(e)=>setEmail(e.target.value)}
// className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
// required
// />

// </div>


// {/* PASSWORD */}

// <div className="relative">

// <Lock size={18} className="absolute top-3 left-3 text-gray-400"/>

// <input
// type="password"
// placeholder="Password"
// value={password}
// onChange={(e)=>setPassword(e.target.value)}
// className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-400"
// required
// />

// </div>


// {/* LOGIN BUTTON */}

// <button
// type="submit"
// className="w-full bg-green-500 text-black py-3 rounded-xl font-semibold hover:bg-green-400 transition shadow-lg"
// >
// Sign In
// </button>

// </form>


// {/* LINKS */}

// <div className="flex justify-between text-sm mt-6 text-gray-500">

// <span className="cursor-pointer hover:text-green-500">
// Forgot password?
// </span>

// <span
// className="cursor-pointer text-green-600"
// onClick={()=>navigate("/signup")}
// >
// Create account
// </span>

// </div>

// </div>

// </div>

// </div>

//   );

// };

// export default Login;
// import { useNavigate } from "react-router-dom";
// import { Mail, Lock } from "lucide-react";
// import { useState } from "react";
// import api, { setAuthToken } from "../services/api";

// const Login = () => {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleLogin = async (e) => {
//   e.preventDefault();
//   setError("");

//   try {
//     const res = await api.post("/users/login/", {
//       username: email,
//       password: password,
//     });

//     const { access, refresh, role } = res.data;

//     localStorage.setItem("access", access);
//     localStorage.setItem("refresh", refresh);
//     localStorage.setItem("userRole", role);

//     setAuthToken(access);

//     navigate(`/${role}`);

//   } catch (err) {
//     setError("Invalid credentials");
//   }
// };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">

//       <div className="bg-white w-[400px] p-8 rounded-2xl shadow-lg">

//         {/* Logo Circle */}
//         <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold mb-6">
//           V
//         </div>

//         <h1 className="text-2xl font-bold text-center">
//           Welcome to VetCare Hub
//         </h1>
//         <p className="text-gray-500 text-center mb-6">
//           Sign in to continue
//         </p>

//         {/* Google Button */}
//         <button className="w-full border py-2 rounded-xl mb-4 hover:bg-gray-50">
//           Continue with Google
//         </button>

//         <div className="flex items-center gap-3 mb-4">
//           <div className="flex-1 h-px bg-gray-200" />
//           <span className="text-sm text-gray-400">OR</span>
//           <div className="flex-1 h-px bg-gray-200" />
//         </div>

//         {/* Form */}
//         <form onSubmit={handleLogin} className="space-y-4">

//           {/* Email */}
//           <div className="relative">
//             <Mail size={16} className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="relative">
//             <Lock size={16} className="absolute top-3 left-3 text-gray-400" />
//             <input
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full pl-10 pr-3 py-2 rounded-xl border bg-gray-50"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-900 text-white py-2 rounded-xl hover:bg-blue-800"
//           >
//             Sign in
//           </button>
//         </form>

//         <div className="flex justify-between text-sm mt-4 text-gray-500">
//           <span>Forgot password?</span>
//           <span
//             className="cursor-pointer text-blue-600"
//             onClick={() => navigate("/signup")}
//           >
//             Need an account? Sign up
//           </span>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default Login;