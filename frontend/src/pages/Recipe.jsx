import React, { useState } from "react";
import { Search } from "lucide-react";

function Recipe() {
  const [ingredients, setIngredients] = useState("");
  const [time, setTime] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `http://127.0.0.1:8000/recommend?ingredients=${encodeURIComponent(
        ingredients
      )}&top_n=10`;
      if (time) url += `&max_time=${time}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch recipes");

      const data = await response.json();
      setRecipes(data.results || []);
    } catch (err) {
      setError(err.message);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-container padding-container flex flex-col items-center py-12 mt-8 lg:py-20">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wide text-[#d33232]">
          Recipe Finder
        </h1>
        <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
          Enter your ingredients and cooking time to discover delicious recipes
          tailored for you.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#161616] p-6 rounded-2xl shadow-xl w-full max-w-3xl border border-[#1e1e1e]">
        <input
          type="text"
          placeholder="Enter ingredients (comma separated)..."
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          className="w-full md:flex-1 border border-[#1e1e1e] bg-[#1e1e1e] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d33232] transition"
        />
        <input
          type="number"
          placeholder="Max Time (mins)"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full md:w-44 border border-[#1e1e1e] bg-[#1e1e1e] text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d33232] transition"
        />
        <button
          onClick={fetchRecipes}
          className="flex items-center justify-center gap-2 bg-[#d33232] hover:bg-[#b72c2c] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition-all"
        >
          <Search size={18} />
          Search
        </button>
      </div>

      {loading && <p className="mt-6 text-gray-400">Loading recipes...</p>}
      {error && <p className="mt-6 text-red-500">Error: {error}</p>}

      <div className="mt-12 w-full max-w-3xl space-y-5">
        {recipes.length === 0 && !loading && !error ? (
          <p className="text-center text-gray-500 italic">
            No recipes yet. Try searching above.
          </p>
        ) : (
          recipes.map((r, index) => (
            <div
              key={index}
              className="p-6 bg-[#1e1e1e] rounded-xl shadow-lg border border-[#161616] hover:border-[#d33232] transition flex flex-col md:flex-row gap-6"
            >
              {r.image && (
                <img
                  src={r.image}
                  alt={r.recipe}
                  className="w-full md:w-40 h-40 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-[#d33232] mb-2">
                  {r.recipe}
                </h2>
                <p className="text-gray-400">Time: {r.time || "N/A"} mins</p>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 text-sm font-medium text-[#d33232] hover:underline"
                  >
                    View Recipe →
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

export default Recipe;
