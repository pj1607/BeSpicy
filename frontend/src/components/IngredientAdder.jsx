import React, { useState } from "react";

const IngredientAdder = ({ ingredients, setIngredients }) => {
  const [input, setInput] = useState("");
  const foodSuggestions = [
    "Tomato",
    "Onion",
    "Garlic",
    "Ginger",
    "Chicken",
    "Paneer",
    "Rice",
    "Potato",
    "Milk",
    "Cheese",
  ];

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const value = input.trim();
      if (value && !ingredients.includes(value)) {
        setIngredients([...ingredients, value]); // notify parent
      }
      setInput("");
    }
  };

  const removeIngredient = (item) => {
    setIngredients(ingredients.filter((ing) => ing !== item));
  };

  const filteredSuggestions = foodSuggestions.filter(
    (item) =>
      item.toLowerCase().startsWith(input.toLowerCase()) &&
      !ingredients.includes(item)
  );

  return (
    <div className="w-full md:flex-1 p-3 rounded-lg bg-[#1e1e1e] border border-[#1e1e1e]">
      <div className="flex flex-wrap gap-2 mb-2">
        {ingredients.map((item) => (
          <div
            key={item}
            className="flex items-center bg-[#d33232] text-white px-3 py-1 rounded-full text-sm"
          >
            {item}
            <button
              onClick={() => removeIngredient(item)}
              className="ml-2 text-white font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Add ingredients..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 bg-[#1e1e1e] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d33232]"
      />

      {input && filteredSuggestions.length > 0 && (
        <ul className="bg-[#2a2a2a] mt-1 rounded-md max-h-40 overflow-auto">
          {filteredSuggestions.map((item) => (
            <li
              key={item}
              onClick={() => {
                setIngredients([...ingredients, item]);
                setInput("");
              }}
              className="px-3 py-2 cursor-pointer hover:bg-[#d33232]/50"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default IngredientAdder;
