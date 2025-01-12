"use client";

import { useEffect, useState } from "react";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Retrieve recipes from localStorage
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      const parsedRecipes = [...JSON.parse(storedRecipes)].slice(0, 5);
      setRecipes(parsedRecipes);
    }
  }, []); // Empty dependency ensures this runs only once

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
      {/* Sidebar with recipe titles */}
      <div className="w-1/3 p-8 overflow-y-auto">
        <h1 className="text-4xl font-semibold text-white mb-6">Recipes</h1>
        <ul className="space-y-4">
          {recipes.map((recipe, index) => (
            <li
              key={index}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer text-3xl text-white hover:text-blue-300 transition duration-200"
            >
              {recipe.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Recipe View */}
      <div className="flex-1 p-8 bg-white shadow-lg rounded-l-xl">
        {selectedRecipe ? (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4">
              {selectedRecipe.title}
            </h2>
            <p className="text-xl text-gray-700 mb-4">
              Time to prepare: {selectedRecipe.readyInMinutes} minutes
            </p>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Ingredients:</h3>
            <ul className="list-disc pl-5 text-gray-700">
              {selectedRecipe.usedIngredients.concat(selectedRecipe.missedIngredients).map((ingredient, index) => (
                <li key={index} className="text-lg">{ingredient}</li>
              ))}
            </ul>
            <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-2">Instructions:</h3>
            <p className="text-lg text-gray-700">{selectedRecipe.instructions}</p>
          </div>
        ) : (
          <p className="text-2xl text-gray-700">Select a recipe to see the details.</p>
        )}
      </div>
    </div>
  );
}
