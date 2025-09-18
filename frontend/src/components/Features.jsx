import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, PhoneCall, PlusCircle, Bug } from "lucide-react";

const FeatureCard = ({ title, description, Icon, subText }) => {
  return (
    <motion.div whileHover={{ scale: 1.05 }} className="relative w-[300px] bg-transparent rounded-2xl group cursor-pointer">
      {/* Main card */}
      <div className="bg-[#1e1e1e] p-5 rounded-2xl shadow-md transition-all duration-200 overflow-hidden">
        {/* Status & Time */}
        <div className="flex justify-between text-neutral-500/50 text-xs mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-red-500" />
          </div>
        </div>

        {/* Icon and Title */}
        <div className="flex flex-col items-start gap-3 mb-4">
          <div className="bg-white w-12 h-12 flex items-center justify-center rounded-lg text-black">
            <Icon size={20} />
          </div>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
          <p className="text-white/70 text-sm">{description}</p>
        </div>
      </div>

      <div className="w-[99.5%] left-1/2 -translate-x-1/2 h-[50px] bg-[#d33232] -z-10 rounded-b-[2rem] absolute -bottom-10 [box-shadow:0_-3px_3px_0px_#00000095_inset] -translate-y-[70px] group-hover:translate-y-0 transition-transform duration-200 flex items-end justify-center gap-2 pb-4">
        <div className="flex items-center justify-center gap-2 font-bold text-[#ffffff]">
          <p className="text-xs">{subText}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Features section
const Features = () => {
  const featuresData = [
    {
      title: "Recipe Recommendation",
      description: "Find recipes by ingredients you have. AI-powered recipe suggestions.",
      Icon: PlusCircle,
      subText: "ML Based",
    },
    {
      title: "Nearest Restaurants",
      description: "Find nearby restaurants instantly with location service.",
      Icon: PhoneCall,
      subText: "Location Based",
    },
    {
      title: "Calorie Counter",
      description: "Track calories and plan meals using our smart tools.",
      Icon: Clock,
      subText: "Nutrition Tools",
    },
  ];

  return (
    <section className="w-full relative py-60 flex flex-col gap-20 pb-32">
   

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center gap-12">
        <h2 className="text-4xl font-extrabold text-white text-center mb-10">
          Cook.   <span className="bg-[#d33232] text-white px-2 rounded">Eat.</span> Enjoy.
        </h2>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-8">
          {featuresData.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
