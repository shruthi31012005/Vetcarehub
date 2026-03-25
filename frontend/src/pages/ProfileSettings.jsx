import React, { useState, useEffect } from "react";
import {useLocation} from "react-router-dom";
import { Mail, Phone, MapPin, Building, Save } from "lucide-react";
import api from "../services/api";

const ProfileSettings = () => {
    const location = useLocation();
    const role = location.pathname.split("/")[1]; // Extract role from URL
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get("/users/profile/");
                setProfile(res.data);
            } catch (err) {
                setError("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const [formData, setFormData] = useState({
        email: "bandarushruthi.31@gmail.com",
        phone: "",
        address: "",
        organization: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSave = () => {
        alert("Profile updated successfully!");
    };

    if (loading) {
        return <div className="p-8 bg-gray-50 min-h-screen">Loading profile...</div>;
    }

    if (error) {
        return <div className="p-8 bg-gray-50 min-h-screen">Error: {error}</div>;
    }

    return (
        <div className="p-8 bg-gray-50 min-h-screen">

            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-2">Profile Settings</h1>
            <p className="text-gray-500 mb-8">
                Manage your account information
            </p>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8 flex items-center gap-6">
                <div className="w-16 h-16 bg-green-500 text-white rounded-xl flex items-center justify-center text-2xl font-bold">
                    S
                </div>

                <div>
                    <h2 className="text-xl font-semibold">Shruthi Bandaru</h2>
                    <p className="text-gray-500">
                        {formData.email}
                    </p>
                    <span className="inline-block mt-2 bg-green-100 text-green-600 text-sm px-3 py-1 rounded-full capitalize">
  {role}
</span>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white p-6 rounded-2xl shadow-sm mb-8">

                <h3 className="text-lg font-semibold mb-6">
                    Contact Information
                </h3>

                <div className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-600 mb-2">
                            <Mail size={16} />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            readOnly
                            className="w-full border border-gray-200 rounded-xl p-3 bg-gray-100"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-600 mb-2">
                            <Phone size={16} />
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="phone"
                            placeholder="Enter phone number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-600 mb-2">
                            <MapPin size={16} />
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                    {/* Organization */}
                    <div>
                        <label className="flex items-center gap-2 text-gray-600 mb-2">
                            <Building size={16} />
                            Farm/Organization Name
                        </label>
                        <input
                            type="text"
                            name="organization"
                            placeholder="Enter farm or organization name"
                            value={formData.organization}
                            onChange={handleChange}
                            className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                    </div>

                </div>
            </div>

            {/* Save Button */}
            <button
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-green-700 transition"
            >
                <Save size={18} />
                Save Changes
            </button>

        </div>
    );
};

export default ProfileSettings;