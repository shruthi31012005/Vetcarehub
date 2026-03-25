import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  PawPrint,
  Stethoscope,
  Shield,
  FileText,
  Calendar,
  MessageCircle,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Globe,
  LogOut,
  ChevronDown,
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const basePath = `/${role}`;

  return (
    <div className="w-64 h-screen bg-white border-r flex flex-col justify-between">

      {/* ================= TOP SECTION ================= */}
      <div>

        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-green-600">
            VetCare Hub
          </h1>
          <p className="text-xs text-gray-400">AI Animal Health</p>
        </div>

        {/* ================= NAVIGATION ================= */}
        <div className="p-4 space-y-2">

          {/* ================= OWNER MENU ================= */}
          {role === "owner" && (
            <>
              <SidebarItem to={`${basePath}`} icon={<Home size={18} />} label="Dashboard" end />
              <SidebarItem to={`${basePath}/animals`} icon={<PawPrint size={18} />} label="My Animals" />
              <SidebarItem to={`${basePath}/disease-prediction`} icon={<Stethoscope size={18} />} label="Disease Prediction" />
              <SidebarItem to={`${basePath}/risk-prediction`} icon={<Shield size={18} />} label="Risk Prediction" />
              <SidebarItem to={`${basePath}/health-records`} icon={<FileText size={18} />} label="Health Records" />
              <SidebarItem to={`${basePath}/vaccinations`} icon={<Calendar size={18} />} label="Vaccinations" />
              <SidebarItem to={`${basePath}/appointments`} icon={<Calendar size={18} />} label="Appointments" />
              <SidebarItem to={`${basePath}/ai-assistant`} icon={<MessageCircle size={18} />} label="AI Assistant" />
            </>
          )}

          {/* ================= VET MENU ================= */}
          {role === "vet" && (
            <>
              <SidebarItem to={`${basePath}/dashboard`} icon={<Home size={18} />} label="Dashboard" />
              <SidebarItem to={`${basePath}/cases`} icon={<ClipboardList size={18} />} label="Cases" />
              <SidebarItem to={`${basePath}/disease-prediction`} icon={<Stethoscope size={18} />} label="Disease Prediction" />
              <SidebarItem to={`${basePath}/appointments`} icon={<Calendar size={18} />} label="Appointments" />
              <SidebarItem to={`${basePath}/vaccinations`} icon={<Calendar size={18} />} label="Vaccinations" />
              <SidebarItem to={`${basePath}/ai`} icon={<MessageCircle size={18} />} label="AI Assistant" />
              <SidebarItem to={`${basePath}/add-animal`} icon={<PawPrint size={18} />} label="Add Animal" />
            </>
          )}

          {/* ================= ADMIN MENU ================= */}
          {role === "admin" && (
            <>
              <SidebarItem to={`${basePath}`} icon={<Home size={18} />} label="Admin Dashboard" end />
              <SidebarItem to={`${basePath}/users`} icon={<Users size={18} />} label="Users" />
              <SidebarItem to={`${basePath}/animals`} icon={<PawPrint size={18} />} label="Animals" />
              <SidebarItem to={`${basePath}/diseases`} icon={<Stethoscope size={18} />} label="Diseases" />
              <SidebarItem to={`${basePath}/appointments`} icon={<Calendar size={18} />} label="Appointments" />
              <SidebarItem to={`${basePath}/reports`} icon={<BarChart3 size={18} />} label="Reports" />
            </>
          )}

        </div>
      </div>

      {/* ================= BOTTOM PROFILE SECTION ================= */}
      <div className="p-4 border-t relative">

        <div
          onClick={() => setOpenDropdown(!openDropdown)}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center font-semibold">
              S
            </div>
            <div>
              <p className="text-sm font-medium">Shruthi Bandaru</p>
              <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                {role}
              </span>
            </div>
          </div>
          <ChevronDown size={16} />
        </div>

        {openDropdown && (
          <div className="absolute bottom-16 left-4 w-52 bg-white shadow-lg rounded-xl border p-2 space-y-1 z-50">

            <div
              onClick={() => {
                navigate(`${basePath}/profile`);
                setOpenDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            >
              <Settings size={16} />
              Profile Settings
            </div>


            <div
              onClick={() => {
                localStorage.removeItem("access");
                localStorage.removeItem("refresh");
                localStorage.removeItem("user");
                navigate("/login");
                setOpenDropdown(false);
              }}
              className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
            >
              <LogOut size={16} />
              Logout
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const SidebarItem = ({ to, icon, label, end = false }) => {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
          isActive
            ? "bg-green-100 text-green-600 font-medium"
            : "text-gray-700 hover:bg-gray-100"
        }`
      }
    >
      {icon}
      {label}
    </NavLink>
  );
};

export default Sidebar;