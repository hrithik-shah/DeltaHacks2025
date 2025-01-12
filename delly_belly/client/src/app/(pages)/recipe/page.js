"use client";

import { useState } from "react";

export default function Recipes() {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipes, setRecipes] = useState([
    {
      title: "Chicken Curry",
      readyInMinutes: 30,
      ingredients: ["chicken", "tomatoes", "potatoes", "spices"],
      instructions:
        "1. Cook the chicken with spices. 2. Add tomatoes and potatoes. 3. Simmer for 30 minutes.",
    },
    {
      title: "Egg Salad",
      readyInMinutes: 15,
      ingredients: ["eggs", "tomatoes", "peas", "lettuce"],
      instructions:
        "1. Boil the eggs. 2. Chop the vegetables. 3. Mix together with a dressing.",
    },
    {
      title: "Potato and Chicken Bake",
      readyInMinutes: 40,
      ingredients: ["potatoes", "chicken", "cheese", "cream"],
      instructions:
        "1. Layer potatoes and chicken in a baking dish. 2. Add cream and cheese. 3. Bake for 40 minutes.",
    },
    {
      title: "Tomato Chicken Soup",
      readyInMinutes: 25,
      ingredients: ["chicken", "tomatoes", "onions", "spices"],
      instructions:
        "1. Cook chicken and onions. 2. Add tomatoes and spices. 3. Simmer for 25 minutes.",
    },
    {
      title: "Peas and Eggs Stir Fry",
      readyInMinutes: 20,
      ingredients: ["peas", "eggs", "onions", "spices"],
      instructions:
        "1. Scramble eggs. 2. Cook peas and onions in a pan. 3. Combine and stir-fry for 20 minutes.",
    },
  ]);

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
              {selectedRecipe.ingredients.map((ingredient, index) => (
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
