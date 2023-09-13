"use client";
import Costcard from "@/Components/Costcard";
import { CostState } from "@/Components/Costcontext";
import { fetchfilesStart } from "@/redux/files";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { calculateIngredientsCost } from "./functions";

const UnFilledRecipe = ({file}) => {
  const [ingredients, setIngredients] = useState([]);
  const [percentageProfit, setPercentageProfit] = useState(0);
  const [labourCostPerHour, setLabourCostPerHour] = useState(0);
  const [overheadCost, setOverheadCost] = useState(0);
  const [content, setContent] = useState("");
  const [hours, setHours] = useState(0);
  const [servings, setServings] = useState(1);
  const user = useSelector((state) => state.user.currentUser);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const { totalCost, setTotalCost} = CostState();

  const ingredientRegex =
    /(?:\d+\s*(?:[\d\/\s]+)?(?:cup|cups|tbsp|tsp|tablespoon|teaspoon|oz|ounce|pound|lb|g|gram|kg|kilogram|ml|milliliter|ltr|liter|tbsp|tsp|p|pt|qt|quart|gal|gallon)?(?:s)?)?\s+(?:[a-zA-Z]+\s+)*(?:[\w\s\-\'\,\/\(\)]+)/i;
  function isRecipeIngredient(sentence) {
    return ingredientRegex.test(sentence);
  }
  
  const handleIngredients = async (recipeIngredients) => {
    const ingredientsarr = recipeIngredients.split(/\r?\n/); //get all ingredients and measures individually
    //if each sentence is a valid ingredient, split it to get the quantity, measure, item and push it to currentingredients
    let toUse=[];
    for (let i = 0; i < ingredientsarr.length; i++) {
      let obj = {};
      const parts = ingredientsarr[i].split(/(\d+(?:\.\d+)?)(\D+)/);;
      const ingStr = `${parts[1].trim()} ${parts[2].trim()}`;
      if (isRecipeIngredient(ingStr)) {
        
        const component = ingStr.split(" ");
        if (component.length > 2) {
          const itemName = component.slice(2, component.length).join(" ");
          obj["quantity"] = component[0];
          obj["measure"] = component[1];
          obj["item"] = itemName;
        } else {
          const itemName = component.slice(1, component.length).join(" ");
          obj["quantity"] = component[0];
          obj["item"] = itemName;
        }
        toUse.push(obj)
        setIngredients(toUse);
      } else {
      console.log('not an ingredient',ingredientsarr[i]);
    }
    }
    return toUse;
  };

  const handleCalculateCost = async () => {
    const recipeObj = {
      name: file.name,
      servings:servings,
      content: content,
      LabourCost: labourCostPerHour,
      LabourHours: hours,
      Overheads: overheadCost,
      Profit: percentageProfit,      
    };
    await axios
      .put(
        `https://bakepricely.onrender.com/api/folder//editfilecontent?userid=${user._id}&fileid=${file._id}`,
        recipeObj,
        config
      )
      .then((res) => {
        let saved;
        res.data.nofolderfiles.map((f) => {
          if (f._id === file._id) {
            saved = f;
          }
        });
        if (saved) {
        handleIngredients(content).then((ingredientsTouse)=>{
            calculateIngredientsCost(ingredientsTouse, user).then((costOfIngredients)=>{
              const totalInclusive = Number(costOfIngredients + saved.LabourCost * saved.LabourHours + saved.Overheads)
              const profit =saved.Profit / 100 * totalInclusive;
              // Add percentage profit
              setTotalCost(totalInclusive + profit);
            })
          })
        }
      });
  };

  useEffect(() => {
    if (servings && content && labourCostPerHour && overheadCost &&percentageProfit && hours) {
      const delayFn = setTimeout(() => handleCalculateCost(), 1500);
      return () => clearTimeout(delayFn);
    }
    //eslint-disable-next-line
  }, [servings, content, labourCostPerHour, overheadCost, percentageProfit, hours]);
  
  
  return (
    <div className="flex flex-col items-start ml-[5vw] md:mt-11">
      <h2 className="font-bold text-[32px]">{file? file.name.charAt(0).toUpperCase() + file.name.slice(1): "New Recipe"} </h2>
      <div className="flex flex-col justify-between items-start">
        <div className="flex items-center my-2">
          <label className="font-semibold text-[22px] mr-3">Servings</label>
          <input
          type="number"
          value={servings}
          onChange={(e) => setServings(parseFloat(e.target.value))}
          className="w-[89px] h-[28px] bg-[#DFDADA] rounded-lg p-5"
          />
        </div>
        <h3 className="text-[22px] font-semibold my-3">Ingredients</h3>
        <textarea
          className="md:w-[350px] w-[80vw] h-[186px] text-base leading-normal
          resize-none p-2.5 border-[1px] border-[black] border-solid rounded-md bg-[#DFDADA] opacity-80"
          value={content}
          placeholder="Enter ingredients in the format quantity measure ingredient eg: 1 cup flour. Press enter after each ingredient"
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        {ingredients && 
        <>
        <h3 className="text-[22px] font-semibold my-3">Ingredient Costs </h3>
        <div className="md:grid grid-cols-[repeat(2,2fr)] gap-x-3 gap-y-3 flex flex-col mb-7 mx-3">
          {ingredients.map((ingredient, index) => {
            return <Costcard ingredient={ingredient} key={index} />;
          })}
        </div>
        </>
        }
        <h3 className="text-[22px] font-semibold my-3">Other Costs</h3>
        <form className="md:w-[507px] w-[80vw] md:mr-0 mr-5 h-fit bg-[#DFDADA] opacity-80 flex flex-col p-3">
          <div className="flex items-start md:justify-around justify-between my-2">
            <label className="font-semibold md:text-[18px] "> % Profit</label>
            <input
              type="number"
              value={percentageProfit}
              onChange={(e) => setPercentageProfit(parseFloat(e.target.value))}
              className="w-[100px] h-[28px] rounded-lg bg-white p-5"
            />
          </div>
          <div className="flex items-start md:justify-around justify-between my-2">
            <label className="font-semibold text-[18px]">Labour/hour</label>
            <input
              type="number"
              value={labourCostPerHour}
              onChange={(e) => setLabourCostPerHour(parseFloat(e.target.value))}
              className="w-[100px] h-[28px] rounded-lg bg-white p-5"
            />
          </div>
          <div className="flex items-start md:justify-around justify-between my-2">
            <label className="font-semibold text-[18px]">No. of hours</label>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(parseFloat(e.target.value))}
              className="w-[100px] h-[28px] rounded-lg bg-white p-5"
            />
          </div>
          <div className="flex items-start md:justify-around justify-between my-2">
            <label className="font-semibold text-[18px]">Overhead cost</label>
            <input
              type="number"
              value={overheadCost}
              onChange={(e) => setOverheadCost(parseFloat(e.target.value))}
              className="w-[100px] h-[28px] rounded-lg bg-white p-5"
            />
          </div>
        </form>
        <div className="md:w-[507px] w-[80vw] flex items-center md:justify-around justify-between p-3 mt-5">
          <label className="font-semibold text-[18px]">Total Cost/batch</label>
          <input
              value={totalCost.toFixed(2)}
              className="w-[40%] h-[28px] rounded-lg bg-white md:bg-[#C8626D] p-5"
              readOnly
            />
        </div>
      </div>
    </div>
  );
};

export default UnFilledRecipe;
