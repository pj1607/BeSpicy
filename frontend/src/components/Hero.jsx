import React from "react";
import { motion } from "framer-motion";


const Hero = () => {
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
          width="40"
          height="40"
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
  <span className="bg-red-500 text-white px-2 rounded">Spicy</span>
</h1>

          <p className="text-lg text-white/50">
            Find recipes by ingredients, fix your meal dilemmas, and spice up
            your cooking with AI-powered suggestions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="cursor-pointer px-6 py-3 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-white/80 transition">
             Find recipes 
            </button>
            <button className="cursor-pointer px-6 py-3 rounded-xl border-2 border-white  text-white hover:bg-white/10 ">
              Learn More
            </button>
          </div>
        </motion.div>

        {/* Right illustration */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-10 md:mt-0 md:w-1/2 flex justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            className="w-80 h-80"
          >
            {/* Plate */}
            <circle cx="200" cy="200" r="120" fill="#fff7ed" stroke="#fb923c" strokeWidth="6" />
            {/* Spoon */}
            <rect x="290" y="120" width="18" height="140" rx="9" fill="#9ca3af" />
            <circle cx="299" cy="110" r="22" fill="#9ca3af" />
            {/* Ingredients (tomato, chili, leaf, etc.) */}
            <circle cx="160" cy="180" r="18" fill="#ef4444" />
            <ellipse cx="220" cy="230" rx="14" ry="22" fill="#22c55e" />
            <path
              d="M140 240 C150 220, 180 220, 190 240 C180 260, 150 260, 140 240 Z"
              fill="#f59e0b"
            />
            <path
              d="M200 150 L210 140 L230 160 L220 170 Z"
              fill="#dc2626"
            />
          </svg>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
