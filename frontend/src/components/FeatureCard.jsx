import { useEffect, useRef, useState } from "react";
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="
      p-6
      rounded-2xl
      backdrop-blur-lg
      bg-white/60
      dark:bg-gray-800/60
      border border-white/20
      shadow-xl
      hover:shadow-green-400/20
      hover:scale-105
      transition
      ">
      
      {/* Icon */}
      <div className="
        w-12 h-12 
        bg-green-100 
        text-green-600 
        rounded-xl 
        flex items-center justify-center 
        mb-4
        transition-all 
        duration-300
        group-hover:bg-green-600 
        group-hover:text-white
        group-hover:scale-110
      ">
        {icon}
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 group-hover:text-green-600 transition">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-500 text-sm leading-relaxed">
        {description}
      </p>

    </div>
  );
};

export default FeatureCard;