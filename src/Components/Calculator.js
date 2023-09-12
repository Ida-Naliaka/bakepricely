"use client";
import React, { useEffect, useState } from "react";
import { CostState } from "./Costcontext";
import { BsTrash3Fill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setActiveFile } from "@/redux/files";
import { calculateIngredientsCost, getFiles } from "./functions";
import { useRouter } from "next/navigation";

const Calculator = ({ Newrecipe }) => {
  const [totalCost, setTotalCost] = useState(0);
  const [servingCost, setServingCost] = useState(0);
  const {navItem0, setNavItem0, navItem1, setNavItem1,}= CostState();
  const user = useSelector((state) => state.user.currentUser);
  const dispatch=useDispatch();
  const router=useRouter();
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const ingredientRegex =
    /(?:\d+\s*(?:[\d\/\s]+)?(?:cup|cups|tbsp|tsp|tablespoon|teaspoon|oz|ounce|pound|lb|g|gram|kg|kilogram|ml|milliliter|ltr|liter|tbsp|tsp|p|pt|qt|quart|gal|gallon)?(?:s)?)?\s+(?:[a-zA-Z]+\s+)*(?:[\w\s\-\'\,\/\(\)]+)/i;
  //check if ingredient is in the correct format
  const isRecipeIngredient = (sentence) => {
    return ingredientRegex.test(sentence);
  };

  //process ingredients to format them evenly enough to handle
  const handleIngredients = () => {
    let formatedIngredients=[]
    const ingredientsarr =
      Newrecipe.content && Newrecipe.content.split(/\r?\n/);
    //if each sentence is a valid ingredient, split it to get the quantity, measure, item and push it to currentingredients
      if (ingredientsarr) {
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
            formatedIngredients.push(obj)
          }
        }
        TotalCosting(formatedIngredients)
      }
  };

  const TotalCosting = (ingredients) => {
    calculateIngredientsCost(ingredients, user).then((costOfIngredients)=>{
      const totalInclusive = costOfIngredients + Newrecipe.LabourCost * Newrecipe.LabourHours + Newrecipe.Overheads;
      const profit = (Newrecipe.Profit / 100) * totalInclusive;
      // Add percentage profit
      setTotalCost(totalInclusive + profit);
      setServingCost((totalInclusive + profit) / Newrecipe.servings);
    })
  };

  useEffect(() => {
    handleIngredients();
    //eslint-disable-next-line
  }, []);

  const handledeletefile=async(file)=>{
    try {
      await axios.delete(`http://localhost:5000/api/folder/deletefile?userid=${user._id}&fileid=${file.id}`, config).then((res)=>{
      getFiles(dispatch, user); 
    })
    } catch (error) {
      console.log(error);
    }
}
  return (
    <div 
    className="md:w-[100%] w-[90%] h-fit bg-[#DFDADA] flex flex-col p-3 justify-center w-[373px] h-[157px] rounded-lg">
      <div className="w-full flex items-center justify-between">
        <span
          className="font-semibold text-2xl cursor-pointer"
          onClick={() => {
            dispatch(setActiveFile(Newrecipe));
            setNavItem0("home");
            setNavItem1(Newrecipe.name.charAt(0).toUpperCase() + Newrecipe.name.slice(1));
            router.push('/recipe')
          }}
        >
          {Newrecipe.name.charAt(0).toUpperCase() + Newrecipe.name.slice(1)}
        </span>
        <div
          onClick={() => handledeletefile(Newrecipe)}
          className="bg-[#DFDADA] rounded-full w-fit cursor-pointer"
        >
          <BsTrash3Fill />
        </div>
      </div>
      <div className="flex items-center justify-around my-2">
        <label className="font-semibold text-[18px]">Batch</label>
        <input
        type="number"
        value={totalCost.toFixed(2)}
        className="w-[50%] h-[42px] rounded-lg bg-[#C8626D] text-lg p-2 items-center justify-center"
        readOnly
        />
      </div>
      <div className="flex my-2 items-center justify-around">
        <label className="font-semibold text-[18px]">Serving</label>
        <input
        type="number"
        value={servingCost.toFixed(2)}
        className="w-[50%] h-[42px] rounded-lg bg-[#C8626D] text-lg p-2 "
        readOnly
        />
      </div>
    </div>
  );
};

export default Calculator;
