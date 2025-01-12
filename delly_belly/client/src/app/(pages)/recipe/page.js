"use client";

import { useEffect, useState } from "react";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    // Retrieve recipes from localStorage
    const storedRecipes = localStorage.getItem('recipes');
    if (storedRecipes) {
      const parsedRecipes = [...JSON.parse(storedRecipes) ]
      setRecipes(parsedRecipes);
    }
  }, []); // Empty dependency ensures this runs only once

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#FFD59E] via-[#FFC76B] to-[#FFB347] overflow-hidden">
      {/* Sidebar with recipe titles */}
      <div className="w-1/3 p-8 overflow-y-auto">
        <h1 className="text-4xl font-semibold mb-6 text-[#522E1A]">Recipes</h1>
        <ul className="space-y-6">
          {recipes.map((recipe, index) => (
            <li
              key={index}
              onClick={() => setSelectedRecipe(recipe)}
              className="cursor-pointer text-2xl text-[#522E1A] hover:text-[#92400e] hover:bg-[#ffecd2] p-3 rounded-md transition duration-200"
            >
              {recipe.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Detailed Recipe View */}
      <div className="flex-1 p-8 bg-[#fefce8] shadow-lg rounded-l-xl">
        {selectedRecipe ? (
         <div className="max-w-2xl mx-auto">
  <h2 className="text-3xl font-bold text-[#522E1A] mb-4 underline decoration-black pt-4 pb-2">
    {selectedRecipe.title}
  </h2>

            

            <div className="mb-6">
              <h3 className="text-2xl font-semibold text-[#522E1A] mb-2">Ingredients:</h3>
              <ul className="list-disc pl-6 text-[#522E1A]">
                {selectedRecipe.usedIngredients.concat(selectedRecipe.missedIngredients).map((ingredient, index) => (
                  <li key={index} className="text-lg mb-2">{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#522E1A] mt-6 mb-2">Instructions:</h3>
              <div className="text-lg text-[#522E1A] space-y-4">
                {selectedRecipe.instructions
                  .replace(/^"|"$/g, '') // Remove leading and trailing quotation marks
                  .split('\n') // Split by new lines
                  .map((line, index) => (
                    <p key={index}>
                      {line}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-3xl font-semibold text-[#522E1A] text-center">Select a recipe to see the details!</p>
        )}
      </div>
    </div>
  );
}
