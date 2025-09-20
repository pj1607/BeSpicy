import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecipeModal = ({ recipe, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (recipe) setVisible(true);
    else setVisible(false);
  }, [recipe]);

  // Disable page scroll when modal is open
  useEffect(() => {
    if (visible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  if (!recipe) return null;

  const ingredientsList = recipe.Ingredients
    ? recipe.Ingredients.split(/\r?\n|,|;/).map(item => item.trim()).filter(Boolean)
    : [];
  const instructionsList = recipe.Instructions
    ? recipe.Instructions.split(/\r?\n|\.|;/).map(item => item.trim()).filter(Boolean)
    : [];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          ></motion.div>

          {/* Bottom Sheet */}
          <motion.div
            className="fixed left-0 right-0 bottom-0 z-50 p-6 bg-[#1e1e1e] rounded-t-3xl shadow-xl max-h-[80vh] overflow-y-auto max-w-5xl mx-auto w-full"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="cursor-pointer absolute top-3 right-3 text-white text-2xl font-bold hover:text-gray-300"
            >
              ×
            </button>

            {/* Recipe Title */}
            <h2 className="text-3xl font-extrabold mb-4 text-white border-b border-gray-700 pb-2">
              {recipe.recipe}
            </h2>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.Cuisine && <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">{recipe.Cuisine}</span>}
              {recipe.Course && <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">{recipe.Course}</span>}
              {recipe.Diet && <span className="px-3 py-1 bg-yellow-600 text-white rounded-full text-sm">{recipe.Diet}</span>}
            </div>

            {/* Time Info */}
            <div className="mb-4 p-4 bg-gray-800 rounded-lg flex justify-between text-white/90 text-sm">
              <span><strong>Prep:</strong> {recipe.PrepTimeInMins} mins</span>
              <span><strong>Cook:</strong> {recipe.CookTimeInMins} mins</span>
              <span><strong>Total:</strong> {recipe.TotalTimeInMins} mins</span>
            </div>

            {/* Servings */}
            <div className="mb-4 text-white/90">
              <strong>Servings:</strong> {recipe.Servings}
            </div>

            {/* Ingredients */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Ingredients</h3>
              <ul className="list-disc list-inside text-white/90">
                {ingredientsList.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-white mb-2">Instructions</h3>
              <ol className="list-decimal list-inside text-white/90">
                {instructionsList.map((step, index) => (
                  <li key={index} className="mb-1">{step}</li>
                ))}
              </ol>
            </div>

            {/* Recipe Link */}
            {recipe.url && (
              <a
                href={recipe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-4 px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              >
                Open Recipe Link
              </a>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RecipeModal;
