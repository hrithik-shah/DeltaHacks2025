"use client";

import React, { useState } from "react";
import { Fugaz_One, Inter, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
const fugazOne = Fugaz_One({ subsets: ["latin"], weight: "400" });

const Homepage = () => {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const [ingredientsUploaded, setIngredientsUploaded] = useState(false);

  const handleFileUpload = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setShowButton(false);

    try {
      const formData = new FormData();
      formData.append("receipt", uploadedFile);

      const response = await axios.post(
        'http://127.0.0.1:5000/upload',
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = response.data;
      if (data.items) {
        setIngredients(data.items);
        setIngredientsUploaded(true);
      } else {
        console.error("No items found in the response.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setIngredients([]);
    document.getElementById("file-input").value = "";
  };

  const getRecipes = async (items) => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/recipes', { items });
  
      // Handle the successful response
      return response.data.recipes; 
    } catch (error) {
      // Handle errors
      if (error.response) {
        console.error('Error Response:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
      throw error;
    }
  };

  const navigateTo = (pagename) => {
    getRecipes(ingredients)
      .then((recipes) => {
        localStorage.setItem('recipes', JSON.stringify(recipes));
        router.push(`http://localhost:3000/${pagename}`);
      });
  };

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-[#FFD59E] via-[#FFC76B] to-[#FFB347] overflow-hidden ${inter.className}`}
    >
      <h1
        className={`text-5xl text-center text-[#522E1A] font-semibold mb-8 ${poppins.className}`}
      >
        Send us a picture of your grocery receipt and we'll{" "}
        <span className={`font-bold text-[#FF6F3F]${fugazOne.className}`}>cook</span> for you!
      </h1>

      <div className="mb-6">
        {!uploadedFile && !loading && (
          <input
            type="file"
            id="file-input"
            name="file-input"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,image/*"
            className="p-3 text-lg border-2 border-[#522E1A] rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-[#FF6F3F]"

          />
        )}
        {uploadedFile && !loading && (
          <p className="mt-2 text-sm text-[#522E1A]">
            Uploaded File: {uploadedFile.name}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-lg text-[#522E1A]">Processing...</p>
      ) : (
        <div className="mt-6 w-full max-w-md text-lg text-[#522E1A]">
          {ingredients.length > 0 && (
            <ul className="list-decimal pl-5 space-y-2">
              {ingredients.map((ingredient, index) => (
                <li
                  key={index}
                  className="transition-all duration-200 hover:text-[#FF6F3F]"
                >
                  {ingredient}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {uploadedFile && !loading && showButton && (
        <div className="flex gap-6 mt-8">
          <button
            onClick={handleFileUpload}
            className="relative flex items-center justify-center h-12 px-6 text-lg font-sans font-normal text-[#522E1A] bg-[#FFD9C0] border-2 border-[#522E1A] rounded-lg cursor-pointer box-border hover:bg-[#FFC4A3] active:bg-[#FFC4A3] transition-all ease-in-out duration-200"

          >
            Upload
          </button>
          <button
            onClick={handleFileRemove}
            className="relative flex items-center justify-center h-12 px-6 text-lg font-sans font-normal text-[#522E1A] bg-[#FFD9C0] border-2 border-[#522E1A] rounded-lg cursor-pointer box-border hover:bg-[#FFC4A3] active:bg-[#FFC4A3] transition-all ease-in-out duration-200"

          >
            Remove
          </button>
        </div>
      )}

      {uploadedFile && !loading && ingredientsUploaded && (
        <button
          onClick={() => navigateTo("recipe")}
          className="relative flex items-center justify-center h-12 px-6 text-lg font-sans font-normal text-[#522E1A] bg-[#FFD9C0] border-2 border-[#522E1A] rounded-lg cursor-pointer box-border hover:bg-[#FFC4A3] active:bg-[#FFC4A3] transition-all ease-in-out duration-200"

        >
          Next
        </button>
      )}
    </div>
  );
};

export default Homepage;
