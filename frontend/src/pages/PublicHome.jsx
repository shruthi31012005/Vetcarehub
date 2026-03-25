import { useNavigate } from "react-router-dom";
import {
Brain,
Stethoscope,
Calendar,
MessageCircle,
Activity,
Shield,
PawPrint
} from "lucide-react";

import FeatureCard from "../components/FeatureCard";
import FadeIn from "../components/FadeIn";
import ThemeToggle from "../components/ThemeToggle";
import AnimalCarousel from "../components/AnimalCarousel";

const PublicHome = () => {

const navigate = useNavigate();

return(

<div className="flex flex-col min-h-screen bg-white text-gray-900 dark:bg-black dark:text-white">


{/* NAVBAR */}

<nav className="absolute top-0 left-0 w-full z-20 flex items-center justify-between px-12 py-6">

<div className="flex items-center gap-2">

<PawPrint className="text-green-600"/>

<h1 className="text-xl font-bold text-green-600">
VetCare Hub
</h1>

</div>

<div className="flex items-center gap-6">

<button
onClick={()=>navigate("/login")}
className="hover:text-green-600"
>
Sign in
</button>

<button
onClick={()=>navigate("/signup")}
className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500"
>
Get Started
</button>

<ThemeToggle/>

</div>

</nav>



{/* HERO */}

<section className="relative h-screen flex items-center justify-center text-center">

<AnimalCarousel/>

<div className="relative z-10 max-w-3xl px-6">

<FadeIn>

<span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm">
AI Powered Animal Healthcare
</span>

<h1 className="text-6xl font-extrabold mt-6 leading-tight">

Smart Healthcare for

<span className="block text-green-600">
Animals
</span>

</h1>

<p className="mt-6 text-gray-700 text-lg">
Predict diseases, track vaccinations and monitor animal
health using artificial intelligence.
</p>

<div className="flex justify-center gap-6 mt-10">

<button
onClick={()=>navigate("/signup")}
className="bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-500 shadow-lg"
>
Start Free
</button>

<button
className="border border-green-600 text-green-600 px-8 py-4 rounded-xl hover:bg-green-50"
>
Learn More
</button>

</div>

</FadeIn>

</div>

</section>



{/* FEATURES */}

<section className="py-24">

<div className="max-w-6xl mx-auto px-6">

<div className="text-center mb-16">

<h2 className="text-4xl font-bold">
Animal Healthcare Platform
</h2>

<p className="text-gray-500 mt-2">
Tools to keep animals healthy and safe
</p>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

<FeatureCard icon={<Brain/>} title="AI Disease Prediction" description="Detect animal diseases using AI models."/>

<FeatureCard icon={<Stethoscope/>} title="Vet Support" description="Connect with veterinarians."/>

<FeatureCard icon={<Calendar/>} title="Vaccination Tracking" description="Automated reminders."/>

<FeatureCard icon={<MessageCircle/>} title="AI Assistant" description="24/7 chatbot guidance."/>

<FeatureCard icon={<Activity/>} title="Health Monitoring" description="Track animal health records."/>

<FeatureCard icon={<Shield/>} title="Preventive Care" description="Prevent diseases early."/>

</div>

</div>

</section>



{/* CTA */}

<section className="bg-green-600 text-white text-center py-20">

<h2 className="text-4xl font-bold">
Protect Your Animals Today
</h2>

<p className="mt-4">
Join veterinarians and farmers using VetCare Hub
</p>

<button
onClick={()=>navigate("/signup")}
className="mt-8 bg-white text-green-600 px-10 py-4 rounded-xl font-semibold hover:scale-105 transition"
>
Get Started Free
</button>

</section>



{/* FOOTER */}

<footer className="text-center py-6 border-t text-gray-500">

© 2026 VetCare Hub

</footer>

</div>

)

}

export default PublicHome;
