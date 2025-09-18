import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Hero = () => {
    const navigate = useNavigate();

  return (
    
    <section className="max-container padding-container flex flex-col gap-20 py-10 pb-32 mt-10 md:gap-28 lg:py-20 xl:flex-row">
      {/* Background diagonal lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <pattern
          id="diagonalLines"
          patternUnits="userSpaceOnUse"
          width="20"
          height="20"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y="0"
            x2="0"
            y2="40"
            stroke="#f97316"
            strokeWidth="2"
            opacity="0.15"
          />
        </pattern>
        <rect width="100%" height="100%" fill="url(#diagonalLines)" />
      </svg>

      <div className="relative container mx-auto px-6 py-20 flex flex-col md:flex-row items-center">
        {/* Left content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="md:w-1/2 text-center md:text-left space-y-6"
        >
       <h1 className="text-5xl font-extrabold text-white leading-tight">
  Be
  <span className="bg-[#d33232] text-white px-2 rounded">Spicy</span>
</h1>

          <p className="text-lg text-white/50">
           Your all-in-one food companion: discover recipes, track calories, find restaurants, and explore more smart cooking solutions.
          </p>
         <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
  <button
    className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-white/80 transition-all hover:scale-105"
    onClick={() => navigate("/recipe")}
  >
    <Search size={18} />
    <span>Find recipes using ingredients</span>
  </button>
</div>

        </motion.div>

        {/* Right illustration */}
       <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className="flex-1 mt-10 md:mt-0 flex justify-center items-center relative"
        >
         
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="w-64 h-64 bg-white rounded-full flex items-center justify-center shadow-2xl relative"
          >
          <div className="w-32 h-32 bg-[#d33232] rounded-full flex items-center justify-center">
  <motion.svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    className="w-20 h-20 text-white"
    initial={{ scale: 0.8, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Bowl base */}
    <path d="M8 32 C12 52, 52 52, 56 32 Z" />

    {/* Wavy design inside bowl */}
    <path d="M14 36 Q20 40, 26 36 T38 36 T50 36" />

    {/* Food circles */}
    <circle cx="20" cy="24" r="5" />
    <circle cx="28" cy="22" r="5" />
    <circle cx="36" cy="25" r="5" />
    <circle cx="44" cy="22" r="5" />

    {/* Spoon */}
    <path d="M34 16 L46 6" />
  </motion.svg>
</div>


<div
  className="absolute flex flex-col items-center"
  style={{ top: "20%", left: "10%", transform: "rotate(45deg)" }}
>
  {/* Handle */}
  <div className="w-2 h-16 bg-[#FFA500] rounded-full" />
  {/* Spoon head */}
  <div className="w-6 h-6 bg-[#FFA500] rounded-full -mt-2" />
</div>

{/* Fork */}
<div
  className="absolute"
  style={{ bottom: "20%", right: "10%", transform: "rotate(-45deg)" }}
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 120"
    className="w-16 h-28"
    fill="#FFA500"
  >
{/* Handle with capsule ends */}
<rect x="22" y="40" width="6" height="100" rx="3" ry="3" />



    {/* Head */}
    <rect x="15" y="20" width="20" height="25" rx="3" />

    {/* Prongs */}
    <rect x="15" y="5" width="3" height="20" rx="1.5" />
    <rect x="20" y="5" width="3" height="20" rx="1.5" />
    <rect x="26" y="5" width="3" height="20" rx="1.5" />
    <rect x="32" y="5" width="3" height="20" rx="1.5" />
  </svg>
</div>




          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;


