import { PawPrint } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
export default function Navbar() {

  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b bg-white dark:bg-gray-900">

      <div className="flex items-center gap-2">

        <PawPrint className="text-green-600" />

        <h1 className="text-lg font-bold text-green-600">
          VetCare Hub
        </h1>

      </div>

      <div className="flex items-center gap-6">

            <button
            onClick={() => navigate("/login")}
            className="text-gray-600 hover:text-green-600 transition"
            >
            Sign in
            </button>

            <button
            onClick={() => navigate("/signup")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition shadow"
            >
            Get Started
            </button>

            <ThemeToggle/>

            </div>

    </nav>
  );
}