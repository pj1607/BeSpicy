import React, { useState, useEffect } from "react";
import { Search, Clock, List, ChefHat,ChevronDown  } from "lucide-react";
import RecipeModal from "../modal/RecipeModal";
import IngredientAdder from "../components/IngredientAdder";
import { motion } from "framer-motion"; // For animations
import * as Select from "@radix-ui/react-select";

const Recipe = () => {
  const [ingredients, setIngredients] = useState([]);
  const [time, setTime] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [sortOption, setSortOption] = useState("Default");

  const RESULTS_PER_PAGE = 4;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // Animate page load (fade in)
    document.querySelector("section").classList.add("fade-in");
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `${API_URL}/recommend?ingredients=${encodeURIComponent(
        ingredients.join(",")
      )}&top_n=50`;
      if (time) url += `&max_time=${time}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();
      setRecipes(data.results || []);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message);
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
      {/* Decorative SVG Background */}
      <svg
        className="absolute top-0 right-0 w-64 h-64 opacity-20 text-[#d33232] animate-spin-slow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
      </svg>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-10 relative z-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#ffffff] flex items-center justify-center gap-2">
          <ChefHat size={32} /> Recipe 
          <span className="bg-[#d33232] text-white px-2 rounded">Finder</span>
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
      className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition"
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
                         hover:bg-[#d33232] hover:text-white 
                         focus:bg-[#d33232] focus:text-white outline-none"
            >
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
  className="cursor-pointer flex items-center justify-center gap-2 bg-[#d33232] hover:bg-[#b72c2c] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all hover:scale-105"
>
  <span className="flex items-center">
    <Search size={18} />
  </span>
  <span>Search</span>
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
      className="inline-flex items-center justify-between w-full p-3 rounded-lg bg-[#1e1e1e] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-[#d33232] transition"
      aria-label="Sort Recipes"
    >
      <Select.Value placeholder="Sort By" />
      <Select.Icon>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </Select.Icon>
    </Select.Trigger>

    <Select.Portal>
      <Select.Content
        className="z-50 w-full md:w-44 bg-[#1e1e1e] rounded-lg shadow-xl border border-[#333] overflow-hidden"
      >
        <Select.Viewport className="p-1">
          <Select.Item value="Default" className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#d33232] rounded-md">
            <Select.ItemText>Default</Select.ItemText>
          </Select.Item>
          <Select.Item value="TimeLowHigh" className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#d33232] rounded-md">
            <Select.ItemText>Time (Low to High)</Select.ItemText>
          </Select.Item>
          <Select.Item value="TimeHighLow" className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#d33232] rounded-md">
            <Select.ItemText>Time (High to Low)</Select.ItemText>
          </Select.Item>
          <Select.Item value="FewerIngredients" className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#d33232] rounded-md">
            <Select.ItemText>Fewer Ingredients</Select.ItemText>
          </Select.Item>
          <Select.Item value="MoreIngredients" className="px-3 py-2 text-white text-sm cursor-pointer hover:bg-[#d33232] rounded-md">
            <Select.ItemText>More Ingredients</Select.ItemText>
          </Select.Item>
        </Select.Viewport>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
</div>

        </motion.div>
      )}

      {/* Loader */}
      {loading && (
        <div className="flex justify-center mt-8 relative z-10">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-[#d33232]"></div>
        </div>
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
                {r.image ? (
                  <img
                    src={r.image}
                    alt={r.recipe}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-800 rounded-lg mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 64 64">
                      <path d="M12 40 C12 50, 52 50, 52 40 L52 42 C52 52, 12 52, 12 42 Z" fill="#444" />
                      <path d="M14 40 C18 32, 46 32, 50 40 Q46 36, 32 36 Q18 36, 14 40 Z" fill="#f5f5f5" />
                      <path d="M24 28 C25 24, 28 24, 28 20" stroke="#bbb" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <path d="M32 28 C33 24, 36 24, 36 20" stroke="#bbb" strokeWidth="2" fill="none" strokeLinecap="round" />
                      <path d="M40 28 C41 24, 44 24, 44 20" stroke="#bbb" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                  </div>
                )}

           <h2 className="flex items-center gap-2 text-xl font-bold text-[#d33232] mb-2">
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
                  className="cursor-pointer px-4 py-2 bg-[#d33232] hover:bg-red-600 text-white rounded-full font-medium transition hover:scale-105"
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
