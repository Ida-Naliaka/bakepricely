"use client";
import React, { useEffect, useState } from "react";
import data from "./data.json";
import { CostState } from "./Costcontext";
import { useSelector } from "react-redux";
import axios from "axios";
import { costOneIngredient } from "./functions";

const Costcard = ({ ingredient }) => {
  const [packageSize, setPackageSize] = useState(0);
  const [packageUnit, setPackageUnit] = useState("");
  const [packageCost, setPackageCost] = useState(0);
  const [packageContents, setPackageContents] = useState("");
  const [ingredientCost, setIngredientCost] = useState(0);
  const [density, setDensity] = useState("");
  const [units, setUnits] = useState("");
  const [savedIngredient, setSavedIngredient] = useState('');
  const [changed, setChanged] = useState(false);
  const { ingredientsCost, setIngredientsCost,reload, setReload } = CostState();
  const user = useSelector((state) => state.user.currentUser);
  let densitykeys = Object.keys(data);
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  const getIngredient=async()=>{
    try {
      await axios.get(`https://bakepricely.onrender.com/api/ingredient/${ingredient.item}`, config).then((res)=>{
        setSavedIngredient(res.data)
    })
    } catch (error) {
      console.log(error)
    } 
  }
  //check if it has 3
  //if it has 2  just have package cost, qtty/no.of items in package,
  //if it has 3  do pkg cost pkg size, density
  //take density/cup* quantity= total quantity in weight
  //take tt qtty*pkg cost/pkg size
  //density: custom g/cup, oz/cup, same as water, butter, ap flour, granulated sugar, brown sugar, caster sugar, powdered sugar
  //oats, honey, choc chips, coconut grated cheese, cream cheese, whipping cream, rice, chopped pecans
  const unitDetector = (item) => {
    //eg 120 g/cup 0r 8 oz/cup
    const arr = item.split(" ");
    const str = arr[1];
    if (str.charAt(0) === "g") {
      setUnits("g");
    } else if (str.charAt(0) === "o") {
      setUnits("oz");
    }
  };

  const handleCosting = async () => {
    let newIngredient;
    let updatedIngredient;
      if (savedIngredient && !changed) {
         const costofThisIngredient= await costOneIngredient(ingredient, savedIngredient)
         setIngredientCost(costofThisIngredient);
         setIngredientsCost((prev)=> prev + costofThisIngredient);
         return Number(costofThisIngredient);
      } else if(savedIngredient && changed){
        if( savedIngredient.hasOwnProperty('density')) {
              updatedIngredient = {
                userid: user._id,
                name: ingredient.item,
                density: density? density: savedIngredient.density,
                packageCost: packageCost?packageCost:savedIngredient.packageCost,
                packageSize: packageSize?packageSize:savedIngredient.packageSize,
                packageUnit: packageUnit?packageUnit:savedIngredient.packageUnit,
            }
          } else {
              updatedIngredientIngredient = {
              userid: user._id,
              name: ingredient.item,
              packageCost: packageCost?packageCost:savedIngredient,packageCost,
              packageContents: packageContents?packageContents:savedIngredient.packageContents,
          }
        }
      } else if (!savedIngredient && (packageCost && packageSize && density && packageUnit)) {
        newIngredient = {
          userid: user._id,
          name: ingredient.item,
          density: density,
          packageCost: packageCost,
          packageSize: packageSize,
          packageUnit: packageUnit,
        };
      } else if ( !savedIngredient && packageCost && packageContents) {
        newIngredient = {
          userid: user._id,
          name: ingredient.item,
          packageCost: packageCost,
          packageContents: packageContents,
        };
      }
      try {
        if (newIngredient) {
          axios
            .post("https://bakepricely.onrender.com/api/ingredient", newIngredient, config)
            .then(async(res) => {
              const costofThisIngredient= await costOneIngredient(ingredient, res.data)
              setIngredientCost(costofThisIngredient);
              setIngredientsCost((prev)=> prev + costofThisIngredient);
              setReload(!reload)
              return Number(costofThisIngredient);
            });
          }
          if (updatedIngredient) {
            axios
              .put(`https://bakepricely.onrender.com/api/ingredient/${savedIngredient._id}`, updatedIngredient, config)
              .then(async(res) => {
                const costofThisIngredient= await costOneIngredient(ingredient, res.data)
                setIngredientCost(costofThisIngredient);
                setIngredientsCost((prev)=> prev + costofThisIngredient);
                setReload(!reload)
                return Number(costofThisIngredient);
              });
            }
      } catch (error) {
        console.log(error);
      }
  };
  useEffect(() => {
    if ((packageCost && packageSize && density && packageUnit) ||
    (packageCost && packageContents) ||savedIngredient || changed
    ) {   
    const delayFn = setTimeout(() => handleCosting(), 350);
    return () => clearTimeout(delayFn);
   }
    //eslint-disable-next-line
  }, [packageCost, packageSize, density, packageUnit, packageContents, savedIngredient, changed]);
  
  useEffect(() => {
    getIngredient()
    if (densitykeys.includes(ingredient.item)) {
      setDensity(data[ingredient.item].split(" ")[0]);
      unitDetector(data[ingredient.item]);
    }
    setReload(!reload)
    //eslint-disable-next-line
  }, []);

  return (
  <div className="flex flex-col items-start">
  <h2 className="font-semibold">
    {ingredient.measure &&
    ingredient.quantity + " " + ingredient.measure + " " + ingredient.item}
    {!ingredient.measure && ingredient.quantity + " " + ingredient.item}
      </h2>
    <div className="flex flex-col md:w-fit w-[80vw] items-center justify-center bg-[#DFDADA] p-3 shadow-md">
      <div className=" w-full my-3 flex justify-center items-center">
        <div className="flex flex-col items-center justify-center">
          <label className="font-semibold">Pkg cost </label>
          <input
          type="number"
          placeholder="Package cost"
          value={(savedIngredient && !packageCost) ?savedIngredient.packageCost:(packageCost?packageCost:'')}
          onChange={(e) => {setPackageCost(e.target.value); setChanged(true)}}
          className="w-[60%] h-[42px] rounded-lg bg-white text-lg text-center items-center justify-center"
        />
        </div>
        {ingredient.measure && (
        <div className="flex flex-col items-center">
          <label className="font-semibold">Package size</label>
          <div className="flex w-fit">
            <input
              type="number"
              placeholder="Package size"
              value={(savedIngredient && !packageSize)?savedIngredient.packageSize:(packageSize?packageSize:'')}
              onChange={(e) => {setPackageSize(e.target.value);setChanged(true)}}
              className="w-[60%] h-[42px] text-center rounded-lg bg-white text-lg p-2 items-center justify-center"
            />
            <select onChange={(e) => {setPackageUnit(e.target.value);setChanged(true)}}
            value={(savedIngredient && !packageUnit)?savedIngredient.packageUnit:packageUnit}
            className="w-[40%] h-[42px] rounded-lg bg-white text-lg p-1 ml-2 items-center justify-center">
              <option value="" disabled>select unit</option>
              <option value="ml">ml</option>
              <option value="litre">litre</option>
              <option value="fl.oz">fl.oz</option>
              <option value="oz">oz</option>
              <option value="gal">gal</option>
              <option value="g">g</option>
              <option value="kg">kg</option>
              <option value="lb">lb</option>
            </select>
          </div>
          </div>
          )
      }
      </div>
      {!ingredient.measure && (
        <>
          <label className="font-semibold">Number of items in package</label>
          <input
            type="number"
            placeholder="Quantity in package"
            value={savedIngredient?savedIngredient.packageContents:(packageContents?packageContents:'')}
            onChange={(e) => {setPackageContents(e.target.value);setChanged(true)}}
            className="w-[30%] h-[42px] text-center rounded-lg bg-white text-lg p-2 items-center justify-center"
          />
        </>
      )}
    {(!density && ingredient.measure && !savedIngredient)  && (
    <>
    <label className="font-semibold">Density/cup</label>
    <select
    onChange={(e) => {
    setDensity(e.target.value.split(" ")[0]);
    unitDetector(e.target.value);
    setChanged(true)
  }}
  className="h-fit"
>
  {densitykeys.map((element) => {
    return (
    <option
    value={data[element]}
    key={densitykeys.indexOf(element)}
    >
      density same as {element}
      </option>
      );
      })}
      </select>
      {density === "customgrams" && (
      <>
        <label className="font-semibold"> Custom density</label>
        <input
          type="number"
          placeholder="enter a number g/cup"
          value={density?density:''}
          onChange={(e) => {setDensity(e.target.value); setChanged(true)}}
          className="w-[30%] h-[42px] rounded-lg bg-white text-lg p-2 items-center justify-center"
        />
      </>
      )}
        </>
        )}
        {ingredient.measure &&
        <div className="flex flex-col items-center">
        <label className="font-semibold">Density/cup</label>
          <input
            placeholder="Density"
            value={savedIngredient?savedIngredient.density+" "+ units : density+ " "+units}
            readOnly
            //onChange={(e) => setPackageSize(e.target.value)}
            className="w-[60%] h-[42px] text-center rounded-lg bg-white text-lg p-2 items-center justify-center"
          />
        </div>
        }
      <div className="w-full bg-[#C8626D] my-3 h-[40px] rounded-lg flex items-center justify-center font-semibold text-md">
        {ingredient.quantity} {ingredient.measure ? ingredient.measure : " "}
        {ingredient.measure ? " " : ""}
        {ingredient.item} = {ingredientCost.toFixed(2)}
      </div>
      {!ingredientCost && (
        <div className="text-red text-sm">Fill in all required fields</div>
      )}
    </div>
    </div>
  );
};

export default Costcard;
