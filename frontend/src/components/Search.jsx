import React, { useState } from "react";
import Papa from "papaparse";
import RecipeModal from "../modal/RecipeModal";

const SearchRecipes = () => {
  const [query, setQuery] = useState("");
  const [allResults, setAllResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const RESULTS_PER_PAGE = 4;

  const handleSearch = () => {
    if (!query.trim()) {
      setAllResults([]);
      setCurrentPage(1);
      return;
    }

    setLoading(true);
    const results = [];
    Papa.parse("/IndianFood.csv", {
      download: true,
      header: true,
      skipEmptyLines: true,
      step: (row) => {
        const r = row.data;
        if (
          r.RecipeName?.toLowerCase().includes(query.toLowerCase()) ||
          r.TranslatedRecipeName?.toLowerCase().includes(query.toLowerCase()) ||
          r.Ingredients?.toLowerCase().includes(query.toLowerCase()) ||
          r.TranslatedIngredients?.toLowerCase().includes(query.toLowerCase())
        ) {
          results.push(r);
        }
      },
      complete: () => {
        setAllResults(results);
        setCurrentPage(1);
        setLoading(false);
      },
    });
  };

  const indexOfLast = currentPage * RESULTS_PER_PAGE;
  const indexOfFirst = indexOfLast - RESULTS_PER_PAGE;
  const currentResults = allResults.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(allResults.length / RESULTS_PER_PAGE);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
  <div className="w-full max-w-3xl mx-auto px-4 py-10 relative mb-15">
      {/* Search Bar */}
      <div className="flex mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search recipes..."
          className="flex-1 px-4 py-3 rounded-l-full shadow-md focus:outline-none bg-[#161616] text-white placeholder-gray-400"
        />
        <button
          onClick={handleSearch}
          className="cursor-pointer px-6 py-3 bg-[#d33232] text-white rounded-r-full shadow-md hover:bg-[#e09811] transition"
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-400 text-center">Loading...</p>}

      {currentResults.length > 0 && (
        <div>
          {/* Recipe Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
  {currentResults.map((recipe, index) => (
    <div
      key={index}
      className="bg-[#161616] rounded-xl shadow-lg p-5 hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between"
    >
      <div>
        <h2 className="text-xl font-bold text-white mb-2 tracking-wide truncate">
          {recipe.RecipeName}
        </h2>
        <p className="text-sm text-gray-400 mb-2 line-clamp-3">
          Ingredients: {recipe.Ingredients || "N/A"}
        </p>
        <p className="text-sm text-gray-400 mb-3">
          <span className="text-white font-medium">Total:</span> {recipe.TotalTimeInMins || "-"} mins |{" "}
          <span className="text-white font-medium">Prep:</span> {recipe.PrepTimeInMins || "-"} mins
        </p>
      </div>

      <button
        onClick={() => setSelectedRecipe(recipe)}
        className="cursor-pointer mt-4 px-4 py-2 bg-[#d33232] text-white rounded-full hover:bg-red-600 transition self-start"
      >
        Cook Food
      </button>
    </div>
  ))}
</div>

          {/* Pagination - below cards */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`cursor-pointer px-5 py-2 rounded-full font-medium transition-all duration-200
                ${currentPage === 1
                  ? "bg-black text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-800 shadow-sm"
                }`}
            >
              Prev
            </button>

            <p className="text-gray-400 text-center self-center">
              Page {currentPage} of {totalPages}
            </p>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`cursor-pointer px-5 py-2 rounded-full font-medium transition-all duration-200
                ${currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-700 text-white hover:bg-gray-800 shadow-sm"
                }`}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  );
};

export default SearchRecipes;
