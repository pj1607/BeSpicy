import { useState, useRef, useEffect } from "react";
import { AnimatePresence,motion } from "framer-motion";
import { X, BrickWallFire, ChevronDown, CornerUpRight } from "lucide-react";
import * as Select from "@radix-ui/react-select";

const CalorieCalculator = () => {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [activity, setActivity] = useState("1.2");
  const [calories, setCalories] = useState(null);
  const [bmr, setBmr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
   const [showValidationError, setShowValidationError] = useState(false);

 
const activityLevels = [
  { label: "Sedentary (little/no exercise)", value: "1.2" },
  { label: "Light (1-3 days/week)", value: "1.375" },
  { label: "Moderate (3-5 days/week)", value: "1.55" },
  { label: "Active (6-7 days/week)", value: "1.725" },
  { label: "Very Active (hard exercise daily)", value: "1.9" },

];
const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];


  // Close bottom sheet if click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        setSheetOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
  if (sheetOpen) {
    document.body.style.overflow = "hidden"; 
  } else {
    document.body.style.overflow = "auto"; 
  }
  return () => {
    document.body.style.overflow = "auto";
  };
}, [sheetOpen]);

  useEffect(() => {
    if (showValidationError) {
      const timer = setTimeout(() => setShowValidationError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showValidationError]);

  const calculateCalories = (e) => {
    e.preventDefault();
      if (!age || !heightCm || !weightKg) {
      setShowValidationError(true);
      return;
    }
    setShowValidationError(false);
    setLoading(true);

    setTimeout(() => {
      let calculatedBmr;
      if (gender === "male") {
        calculatedBmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
      } else {
        calculatedBmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
      }

      setBmr(Math.round(calculatedBmr));
     const totalCalories = Math.round(calculatedBmr * parseFloat(activity));

      setCalories(totalCalories);
      setLoading(false);
      setSheetOpen(true);
    }, 1000);
  };

  return (
    <section className="relative max-w-4xl  mx-auto px-4 py-11 mt-30">
      {/* Decorative Background */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-20">
        <svg className="w-full h-full" fill="none" stroke="#d33232" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="29" strokeWidth="5" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            className="w-32 h-32 text-white"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.5}
          >
            <path d="M8 32 C12 52, 52 52, 56 32 Z" />
            <path d="M14 36 Q20 40, 26 36 T38 36 T50 36" />
            <circle cx="20" cy="24" r="5" />
            <circle cx="28" cy="22" r="5" />
            <circle cx="36" cy="25" r="5" />
            <circle cx="44" cy="22" r="5" />
            <path d="M34 16 L46 6" />
          </svg>
        </div>
      </div>


      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 relative z-10"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-white flex flex-wrap justify-center items-center gap-2">
          <BrickWallFire className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0" /> Calorie
          <span className="bg-[#d33232] text-white px-2 rounded block md:inline">
            Calculator
          </span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Estimate your daily calorie needs.
        </p>
      </motion.div>

<motion.form
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.5 }}
  onSubmit={calculateCalories}
  className="bg-[#161616] p-6 rounded-2xl shadow-xl border border-[#1e1e1e] max-w-4xl mx-auto relative z-10 space-y-4"
>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <div>
      <label className="block text-gray-300 mb-1">Age</label>
    <div className="flex items-center w-full max-w-xs border border-[#333] rounded-lg overflow-hidden bg-[#1e1e1e]">
  {/* Decrement button */}
  <button
    type="button"
    className="px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-all"
    onClick={() => setAge(Math.max(0, Number(age) - 1))}
  >
    -
  </button>

  {/* Input field */}
  <input
    type="number"
    className="w-full text-center p-3 bg-[#1e1e1e] text-white appearance-none outline-none no-spinner"
    value={age}
    onChange={(e) => setAge(e.target.value)}
    min={0}
  />

  {/* Increment button */}
  <button
    type="button"
    className="px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-all"
    onClick={() => setAge(Number(age) + 1)}
  >
    +
  </button>
</div>

<style jsx>{`
  /* Only for this input with class 'no-spinner' */
  input.no-spinner::-webkit-inner-spin-button,
  input.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.no-spinner {
    -moz-appearance: textfield;
  }
`}</style>

    </div>
   <div>
  <label className="block text-gray-300 mb-1">Gender</label>
  <Select.Root value={gender} onValueChange={setGender}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition outline-none"
      aria-label="Gender"
    >
      <Select.Value placeholder="Select Gender" />
      <Select.Icon>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        position="popper"
        sideOffset={4}
        className="z-50 w-[var(--radix-select-trigger-width)] bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333] overflow-hidden"
      >
        <Select.Viewport className="p-1">
          {genderOptions.map((g) => (
            <Select.Item
              key={g.value}
              value={g.value}
              className="px-3 py-2 rounded-md text-white text-sm cursor-pointer hover:bg-white/10 data-[highlighted]:bg-white/20 outline-none"
            >
              <Select.ItemText>{g.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>
    <div>
      <label className="block text-gray-300 mb-1">Height (cm)</label>
     <div className="flex items-center w-full max-w-xs border border-[#333] rounded-lg overflow-hidden bg-[#1e1e1e]">
  {/* Decrement button */}
  <button
    type="button"
    className="px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-all"
    onClick={() => setHeightCm(Math.max(0, Number(heightCm) - 1))}
  >
    -
  </button>

  {/* Input field */}
  <input
    type="number"
    className="w-full text-center p-3 bg-[#1e1e1e] text-white appearance-none outline-none no-spinner"
    value={heightCm}
    onChange={(e) => setHeightCm(e.target.value)}
    min={0}
  />

  {/* Increment button */}
  <button
    type="button"
    className="px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-all"
    onClick={() => setHeightCm(Number(heightCm) + 1)}
  >
    +
  </button>
</div>

<style jsx>{`
  /* Only for inputs with class 'no-spinner' */
  input.no-spinner::-webkit-inner-spin-button,
  input.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.no-spinner {
    -moz-appearance: textfield;
  }
`}</style>

    </div>
    <div>
      <label className="block text-gray-300 mb-1">Weight (kg)</label>
      <div className="flex items-center w-full max-w-xs border border-[#333] rounded-lg overflow-hidden bg-[#1e1e1e]">
  {/* Decrement button */}
  <button
    type="button"
    className="px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-all"
    onClick={() => setWeightKg(Math.max(0, Number(weightKg) - 1))}
  >
    -
  </button>

  {/* Input field */}
  <input
    type="number"
    className="w-full text-center p-3 bg-[#1e1e1e] text-white appearance-none outline-none no-spinner"
    value={weightKg}
    onChange={(e) => setWeightKg(e.target.value)}
    min={0}
  />

  {/* Increment button */}
  <button
    type="button"
    className="px-4 py-2 bg-[#333] text-white hover:bg-[#444] transition-all"
    onClick={() => setWeightKg(Number(weightKg) + 1)}
  >
    +
  </button>
</div>

<style jsx>{`
  /* Only affects inputs with 'no-spinner' class */
  input.no-spinner::-webkit-inner-spin-button,
  input.no-spinner::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input.no-spinner {
    -moz-appearance: textfield;
  }
`}</style>

    </div>
  </div>

  {/* Activity Level */}
<div>
  <label className="block text-gray-300 mb-1">Activity Level</label>
  <Select.Root value={activity} onValueChange={setActivity}>
  <Select.Trigger
    className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition outline-none"
    aria-label="Activity Level"
  >
    <Select.Value placeholder="Select Activity" />
    <Select.Icon>
      <ChevronDown className="h-4 w-4 text-gray-400" />
    </Select.Icon>
  </Select.Trigger>

  <Select.Portal>
    <Select.Content
      position="popper"
      sideOffset={4}
      className="z-50 w-[var(--radix-select-trigger-width)] bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333] overflow-hidden"
    >
      <Select.Viewport className="p-1">
        {activityLevels.map((level) => (
          <Select.Item
            key={level.value}
            value={level.value} // string now
            className="px-3 py-2 rounded-md text-white text-sm cursor-pointer hover:bg-white/10 data-[highlighted]:bg-white/20 outline-none"
          >
            <Select.ItemText>{level.label}</Select.ItemText>
          </Select.Item>
        ))}
      </Select.Viewport>
    </Select.Content>
  </Select.Portal>
</Select.Root>

</div>


  {/* Submit Button */}
  <button
    type="submit"
    disabled={loading}
    className="cursor-pointer w-full p-3 bg-white text-black rounded-xl font-bold flex justify-center items-center gap-2 hover:scale-105 transition-all"
  >
    {loading ? (
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
        <span className="w-2 h-2 bg-black rounded-full animate-bounce animation-delay-200"></span>
        <span className="w-2 h-2 bg-black rounded-full animate-bounce animation-delay-400"></span>
      </span>
    ) : (
      "Calculate"
    )}
  </button>
</motion.form>
  {/* Validation Notification (Right Side, Responsive) */}
{showValidationError && (
  <div className="fixed top-4 right-4 sm:top-6 sm:right-6 p-3 bg-gray-800 border-l-4 border-white text-white/80 flex justify-between items-center rounded shadow-md z-50
                  max-w-xs w-[90vw] sm:max-w-sm sm:w-auto
                  animate-fadeIn">
    <span className="text-sm sm:text-base">Please fill in all required fields before calculating.</span>
    <button
      className="cursor-pointer ml-4 font-bold text-lg sm:text-xl leading-none text-white hover:text-red-500 transition-colors duration-200"
      onClick={() => setShowValidationError(false)}
    >
      &times;
    </button>
  </div>
)}



      <AnimatePresence>
  {sheetOpen && (
    <>
      {/* Background Overlay */}
      <motion.div
        className="fixed inset-0 bg-black/40 z-50"
        onClick={() => setSheetOpen(false)}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        exit={{ opacity: 0 }}
      ></motion.div>

      {/* Bottom Sheet */}
     <motion.div
  ref={sheetRef}
  initial={{ y: "100%" }}
  animate={{ y: 0 }}
  exit={{ y: "100%" }} // Slide down when closing
  transition={{ type: "spring", stiffness: 400, damping: 35 }}
  className="fixed bottom-0 left-0 right-0 z-50 p-6 bg-[#161616] rounded-t-3xl shadow-xl max-h-[60vh] overflow-y-auto max-w-5xl mx-auto w-full"
>
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold text-white">Your Results</h2>
    <button
      onClick={() => setSheetOpen(false)}
      className="cursor-pointer text-white hover:text-red-500 transition"
    >
      <X size={24} />
    </button>
  </div>

  <div className="grid grid-cols-1 gap-4">
    <div className="bg-[#1e1e1e] p-4 rounded-xl text-center">
      <h3 className="text-gray-300 mb-1">BMR</h3>
      <p className="text-2xl font-bold text-white">{bmr} kcal/day</p>
      <p className="text-gray-400 text-sm mt-1">Calories burned at rest</p>
    </div>
    <div className="bg-[#1e1e1e] p-4 rounded-xl text-center">
      <h3 className="text-gray-300 mb-1">Maintenance Calories</h3>
      <p className="text-2xl font-bold text-white">{calories} kcal/day</p>
      <p className="text-gray-400 text-sm mt-1">Calories to maintain weight</p>
    </div>
    <div className="bg-[#1e1e1e] p-4 rounded-xl text-center">
      <h3 className="text-gray-300 mb-1">Mild Weight Loss</h3>
      <p className="text-xl font-bold text-white">{Math.round(calories - 250)} kcal/day</p>
    </div>
    <div className="bg-[#1e1e1e] p-4 rounded-xl text-center">
      <h3 className="text-gray-300 mb-1">Mild Weight Gain</h3>
      <p className="text-xl font-bold text-white">{Math.round(calories + 250)} kcal/day</p>
    </div>
  </div>
</motion.div>
    </>
  )}
</AnimatePresence>
    </section>
  );
};

export default CalorieCalculator;
