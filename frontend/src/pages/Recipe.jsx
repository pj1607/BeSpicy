import React, { useState, useEffect } from "react";
import { Search, Clock, List, ChefHat,ChevronDown  } from "lucide-react";
import RecipeModal from "../modal/RecipeModal";
import IngredientAdder from "../components/IngredientAdder";
import { motion } from "framer-motion";
import * as Select from "@radix-ui/react-select";
import axios from "axios";

const Recipe = () => {
  const [ingredients, setIngredients] = useState([]);
  const [time, setTime] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [sortOption, setSortOption] = useState("Default");
  const [searchPerformed, setSearchPerformed] = useState(false);


  const [showNoIngredients, setShowNoIngredients] = useState(false);
  const [lastSearchedIngredients, setLastSearchedIngredients] = useState([]);
const [lastSearchedTime, setLastSearchedTime] = useState("");


  const RESULTS_PER_PAGE = 4;
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    document.querySelector("section").classList.add("fade-in");
  }, []);
  useEffect(() => {
    if (showNoIngredients) {
      const timer = setTimeout(() => setShowNoIngredients(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [showNoIngredients]);


  const fetchRecipes = async () => {
  if (!ingredients || ingredients.length === 0) {
    setShowNoIngredients(true); 
    return;
  } else {
    setShowNoIngredients(false);
  }
  setLoading(true);
  setError(null);

  try {
    let url = `${API}/ml/recommend`;
    const params = {
      ingredients: ingredients.join(","),
      top_n: 50,
    };
    if (time) params.max_time = time;

    const response = await axios.get(url, { params });
    setRecipes(response.data.results || []);
    setCurrentPage(1);

    setLastSearchedIngredients([...ingredients]);
    setLastSearchedTime(time);
    setSearchPerformed(true);
  } catch (err) {
    setError(err.response?.data?.message || err.message);
    setRecipes([]);
  } finally {
    setLoading(false);
  }
};

  const sortedRecipes = [...recipes].sort((a, b) => {
    switch (sortOption) {
      case "TimeLowHigh":
        return (a.TotalTimeInMins || 0) - (b.TotalTimeInMins || 0);
      case "TimeHighLow":
        return (b.TotalTimeInMins || 0) - (a.TotalTimeInMins || 0);
      case "FewerIngredients":
        return (
          (a.Ingredients?.split(/,|;|\r?\n/).length || 0) -
          (b.Ingredients?.split(/,|;|\r?\n/).length || 0)
        );
      case "MoreIngredients":
        return (
          (b.Ingredients?.split(/,|;|\r?\n/).length || 0) -
          (a.Ingredients?.split(/,|;|\r?\n/).length || 0)
        );
      default:
        return 0;
    }
  });

  const indexOfLast = currentPage * RESULTS_PER_PAGE;
  const indexOfFirst = indexOfLast - RESULTS_PER_PAGE;
  const currentResults = sortedRecipes.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(sortedRecipes.length / RESULTS_PER_PAGE);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const options = ["10", "20", "30", "45", "60", "90", "120"];

  return (
   
    <section className="relative max-w-5xl mx-auto px-4 py-12 mt-30 overflow-hidden">
   
<div className="absolute top-0 right-0 w-64 h-64 opacity-20 ">
  {/* Red spinning circle ring */}
  <svg
    className="w-full h-full"
    fill="none"
    stroke="#d33232"
    viewBox="0 0 64 64"
 
  >
    <circle cx="32" cy="32" r="29" strokeWidth="5" />
  </svg>

  {/* Bowl illustration inside the circle */}
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
    </svg>
     

   
  </div>
</div>


      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#ffffff] flex items-center justify-center gap-2">
          <ChefHat size={32} /> Find
          <span className="bg-[#d33232] text-white px-2 rounded">Recipes</span>
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Enter your ingredients and cooking time to discover delicious recipes.
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row items-center gap-4 bg-[#161616] p-6 rounded-2xl shadow-xl border border-[#1e1e1e] w-full max-w-3xl mx-auto relative z-10"
      >
        <IngredientAdder ingredients={ingredients} setIngredients={setIngredients} />

    <div className="relative w-full md:w-44">
  <Select.Root value={time} onValueChange={setTime}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition outline-none "
      aria-label="Select max time"
    >
      <Select.Value placeholder="Max Time (mins)" />
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
          {options.map((opt) => (
          <Select.Item
  key={opt}
  value={opt}
  className="px-3 py-2 rounded-md text-white text-sm cursor-pointer 
             hover:bg-[#ecebeb] hover:text-black 
             data-[highlighted]:bg-[#ffffff] data-[highlighted]:text-black 
             outline-none">
  <Select.ItemText>{opt} mins</Select.ItemText>
</Select.Item>

          ))}
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>

 <button
          onClick={fetchRecipes}
          disabled={loading}
          className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold shadow-lg hover:bg-white/80 transition-all hover:scale-105"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-black rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-black rounded-full animate-bounce animation-delay-200"></span>
              <span className="w-2 h-2 bg-black rounded-full animate-bounce animation-delay-400"></span>
            </span>
          ) : (
            <>
              <Search className="w-4 h-4 flex-shrink-0" /> Search
            </>
          )}
        </button>
</motion.div>




      {/* Sort Dropdown */}
      {recipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 max-w-3xl mx-auto flex justify-end relative z-10"
        >
          <div className="relative w-full md:w-44 z-10">
  <Select.Root value={sortOption} onValueChange={setSortOption}>
    <Select.Trigger
      className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition outline-none"
      aria-label="Sort Recipes"
    >
      <Select.Value placeholder="Sort By" />
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
          <Select.Item value="Default" className="px-3 py-2 rounded-md text-white text-sm cursor-pointer 
             hover:bg-[#ecebeb] hover:text-black 
             data-[highlighted]:bg-[#ffffff] data-[highlighted]:text-black 
             outline-none">
            <Select.ItemText>Default</Select.ItemText>
          </Select.Item>
          <Select.Item value="TimeLowHigh"  className="px-3 py-2 rounded-md text-white text-sm cursor-pointer 
             hover:bg-[#ecebeb] hover:text-black 
             data-[highlighted]:bg-[#ffffff] data-[highlighted]:text-black 
             outline-none">
            <Select.ItemText>Time (Low to High)</Select.ItemText>
          </Select.Item>
          <Select.Item value="TimeHighLow" className="px-3 py-2 rounded-md text-white text-sm cursor-pointer 
             hover:bg-[#ecebeb] hover:text-black 
             data-[highlighted]:bg-[#ffffff] data-[highlighted]:text-black 
             outline-none">
            <Select.ItemText>Time (High to Low)</Select.ItemText>
          </Select.Item>
          <Select.Item value="FewerIngredients" className="px-3 py-2 rounded-md text-white text-sm cursor-pointer 
             hover:bg-[#ecebeb] hover:text-black 
             data-[highlighted]:bg-[#ffffff] data-[highlighted]:text-black 
             outline-none">
            <Select.ItemText>Fewer Ingredients</Select.ItemText>
          </Select.Item>
          <Select.Item value="MoreIngredients"  className="px-3 py-2 rounded-md text-white text-sm cursor-pointer 
             hover:bg-[#ecebeb] hover:text-black 
             data-[highlighted]:bg-[#ffffff] data-[highlighted]:text-black 
             outline-none">
            <Select.ItemText>More Ingredients</Select.ItemText>
          </Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>

        </motion.div>
      )}

      
     {showNoIngredients && (
  <div className="mt-2 p-3 bg-gray-800 border-l-4 border-white text-white/60 flex justify-between items-center rounded shadow-md animate-fadeIn">
    <span>Please (+) add at least one ingredient to search recipes.</span>
    <button
      className="cursor-pointer ml-4 font-bold text-xl leading-none text-white hover:text-red-500 transition-colors duration-200"
      onClick={() => setShowNoIngredients(false)}
    >
      &times;
    </button>
  </div>
)}
{searchPerformed && !loading && (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="mt-4 max-w-3xl mx-auto text-gray-300 flex flex-wrap gap-4 items-center relative z-10"
  >
    <p>
      <span className="font-medium text-white">Ingredients:</span> {lastSearchedIngredients.join(", ")}
    </p>
    {lastSearchedTime && (
      <p>
        <span className="font-medium text-white">Max Time:</span> {lastSearchedTime} mins
      </p>
    )}
  </motion.div>
)}
      {/* Error */}
      {error && <p className="mt-6 text-red-500 text-center relative z-10">{error}</p>}

      {/* Recipes */}
      {!loading && currentResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10"
        >
          {currentResults.map((r, idx) => {
            const ingredientsList = r.Ingredients
              ? r.Ingredients.split(/,|;|\r?\n/).map(i => i.trim()).filter(Boolean).slice(0, 4)
              : [];
            return (
              <motion.div
                key={idx}
                className="bg-[#161616] rounded-xl shadow-lg p-5 flex flex-col justify-between transition-all"
              >
               

           <h2 className="flex items-center gap-2 text-xl font-bold text-[#ffffff] mb-2">
  <List size={20} className="shrink-0" />
  <span className="truncate">{r.recipe}</span>
</h2>

                {ingredientsList.length > 0 && (
                  <ul className="text-gray-400 text-sm mb-2 list-disc list-inside">
                    {ingredientsList.map((ing, i) => <li key={i}>{ing}</li>)}
                    {r.Ingredients && r.Ingredients.split(/,|;|\r?\n/).length > 4 && <li>...</li>}
                  </ul>
                )}

                <p className="text-gray-400 mb-3 flex items-center gap-1">
                  <Clock size={16} /> <span className="text-white font-medium">Total:</span> {r.TotalTimeInMins || r.time || "-"} mins
                </p>

                <button
                  onClick={() => setSelectedRecipe(r)}
                  className="cursor-pointer px-4 py-2 bg-[#ffffff] hover:bg-[#e0e0e0] text-black rounded-full font-medium transition hover:scale-105"
                >
                  Cook Food
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Pagination */}
      {recipes.length > RESULTS_PER_PAGE && (
        <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto relative z-10">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`cursor-pointer px-5 py-2 rounded-full font-medium transition
              ${currentPage === 1
                ? "bg-black text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-800 shadow-sm"
              }`}
          >
            Prev
          </button>
          <p className="text-gray-400">
            Page {currentPage} of {totalPages}
          </p>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`cursor-pointer px-5 py-2 rounded-full font-medium transition
              ${currentPage === totalPages
                ? "bg-black text-gray-400 cursor-not-allowed"
                : "bg-gray-700 text-white hover:bg-gray-800 shadow-sm"
              }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </section>
  
  );
};

export default Recipe;
