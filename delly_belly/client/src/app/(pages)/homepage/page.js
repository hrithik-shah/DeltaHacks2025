"use client";

import React, { useState } from "react";
import { Fugaz_One, Inter, Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
//blabla

const inter = Inter({ subsets: ["latin"] });
const poppins = Poppins({ subsets: ["latin"], weight: "400" });
const fugazOne = Fugaz_One({ subsets: ["latin"], weight: "400" });

const Homepage = () => {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const[showButton, setShowButton] = useState(true);
  const [ingredientsUploaded, setIngredientsUploaded] = useState(false);

  const handleFileUpload = () => {
    if (!uploadedFile) return;

    setLoading(true);
    setShowButton(false);
    setTimeout(() => {
      setIngredients(["chicken", "eggs", "milk", "potatoes", "tomatoes", "peas"]);
      setIngredientsUploaded(true);
      setLoading(false);
    }, 2000);
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

  const navigateTo = (pagename) => {
    router.push(`http://localhost:3000/${pagename}`);
  };

  const handleNext = () => {

  }

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-r from-[#8EC5FC] to-[#E0C3FC] ${inter.className}`}>
      <h1 className={`text-5xl text-center font-semibold mb-8 ${poppins.className}`}>
        Send us a picture of your grocery receipt and we'll <span className={`font-bold ${fugazOne.className}`}>cook</span> for you!
      </h1>

      <div className="mb-6">
        {!uploadedFile && !loading && (
          <input
            type="file"
            id="file-input"
            name="file-input"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,image/*"
            className="p-3 text-lg border-2 border-[#111] rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}
        {uploadedFile && !loading && (
          <p className="mt-2 text-sm text-gray-700">Uploaded File: {uploadedFile.name}</p>
        )}
      </div>

      
      {loading ? (
        <p className="text-lg text-gray-700">Processing...</p>
      ) : (
        <div className="mt-6 w-full max-w-md text-lg text-gray-700">
          {ingredients.length > 0 && (
            <ul className="list-decimal pl-5 space-y-2">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="transition-all duration-200 hover:text-blue-500">{ingredient}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {uploadedFile && !loading && showButton && (
        <div className="flex gap-6 mt-8">
          <button
            onClick={handleFileUpload}
            className="button-56 relative flex items-center justify-center h-12 px-6 text-lg font-sans font-normal text-[#111] bg-[#fee6e3] border-2 border-[#111] rounded-lg cursor-pointer box-border hover:bg-[#ffdeda] active:bg-[#ffdeda] transition-all ease-in-out duration-200"
          >
            Upload
          </button>
          <button
            onClick={handleFileRemove}
            className="button-56 relative flex items-center justify-center h-12 px-6 text-lg font-sans font-normal text-[#111] bg-[#fee6e3] border-2 border-[#111] rounded-lg cursor-pointer box-border hover:bg-[#ffdeda] active:bg-[#ffdeda] transition-all ease-in-out duration-200">
            Remove
          </button>
        </div>
      )}

      {uploadedFile && !loading && ingredientsUploaded && (
        <button
        onClick={() => navigateTo("recipe")}
        className="button-56 relative flex items-center justify-center h-12 px-6 text-lg font-sans font-normal text-[#111] bg-[#fee6e3] border-2 border-[#111] rounded-lg cursor-pointer box-border hover:bg-[#ffdeda] active:bg-[#ffdeda] transition-all ease-in-out duration-200"
      >
        Next
      </button>
      )}

    </div>
  );
};

export default Homepage;
