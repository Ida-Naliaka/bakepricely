import { fetchfilesFailure, fetchfilesSuccess } from "@/redux/files";
import { fetchfoldersStart, fetchfoldersSuccess } from "@/redux/folders";
import { fetchingredientsFailure, fetchingredientsStart, fetchingredientsSuccess } from "@/redux/ingredients";
import axios from "axios";

export const calculateIngredientsCost=async (ingredients, user)=>{
  const config = {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  };
  if(ingredients){
  var totalCost=0
 for (let i=0; i < ingredients.length; i++) {
    const res= await axios.get(`https://bakepricely.onrender.com/api/ingredient/${ingredients[i].item}`, config);
    const cost= costOneIngredient(ingredients[i], res.data);
    totalCost+=cost;
  }
  return totalCost;
 
}
}

export const costOneIngredient=(ingredient, properties)=>{
  if (
    ingredient.hasOwnProperty("item") &&
    ingredient.hasOwnProperty("measure") &&
    ingredient.hasOwnProperty("quantity")
  ) {
    const totalCost=packageSizeHandler(properties, ingredient);
    return totalCost
  } else {
    const totalCost=(ingredient.quantity * properties.packageCost) / properties.packageContents;
    return totalCost
  }
}

const packageSizeHandler = (savedIngredient, ingredient) => {

  const liquidpkgUnits=["ml", "litre" , "gal" , "fl.oz"];
  const solidpkgUnits=["g", "kg", "oz", "lb"];
  const solidWeightMeasures=["g", "kg", "oz", "lb"];
  const liquidMeasures=["cup", "cups", "tsp" , "ml", "mls", "l", "litres", "litre", "tsps", "tbsp",'tbsps'];
  if(
    (ingredient.measure &&
    ingredient.quantity &&
    ingredient.item &&
    savedIngredient.packageUnit.length &&
    savedIngredient.packageSize &&
    savedIngredient.packageCost &&
    savedIngredient.density) 
    ){
      if (liquidpkgUnits.includes(savedIngredient.packageUnit) && liquidMeasures.includes(ingredient.measure)) {
      const Liquidcup = {
        litre: 1000,
        litres: 1000,
        ml: 1,
        mls: 1,
        cup: 240,
        cups: 240,
        gal: 3785,
        gals: 3785,
        "fl.oz": 30,
        tsp: 5,
        tsps: 5,
        tbsp: 15,
        tbsps: 15,
      };
      const similarUnits = Number(savedIngredient.packageSize * Liquidcup[savedIngredient.packageUnit]);
      const response=Number(Liquidcup[ingredient.measure] * (ingredient.quantity) * (savedIngredient.packageCost)) /similarUnits
      return response
    } else if (
      solidpkgUnits.includes(savedIngredient.packageUnit) && solidWeightMeasures.includes(ingredient.measure)
      ) {
        const Solidcup = {
          oz: 28,
          kg: 1000,
          lb: 454,
          g: 1,
        };
        const similarUnits = savedIngredient.packageSize * Solidcup[savedIngredient.packageUnit];
        const response=(Solidcup[ingredient.measure] *
            Number(ingredient.quantity) *
            Number(savedIngredient.packageCost)) /similarUnits
        return response
      } else if (
        solidpkgUnits.includes(savedIngredient.packageUnit) && liquidMeasures.includes(ingredient.measure)
      ) {
        // use 2 tbsp flour;  //2kg 200bob density=140g/cup
        //use 2 cups butter //1lb 500bob density= 226g/cup
        // use 1tsp sugar  // 1kg=170bob density= 200g/cup
        const Solidcup = {
          oz: 28,
          kg: 1000,
          lb: 454,
          g: 1,
        };
        const similarUnits = Number(savedIngredient.packageSize * Solidcup[savedIngredient.packageUnit]);
        //2kg= 2*1000g
        //1lb= 454g
        //1kg= 1000g
        if (ingredient.measure === "cup"|| "cups") {
          //cup-> 2 cups*226g=452g butter  qtty*density
          // butter= 452g*500/454= 498bob
          const response=Number(ingredient.quantity * savedIngredient.density * savedIngredient.packageCost) /similarUnits
          return response;
        }
        if (ingredient.measure === "tbsp"||"tbsps") {
          //tbsp-> 1cup=16tbsp :: 2tbsp= 2* 140/16 = 17.5g qtty*density/cuptbsp
          // flour= 17.5g*200 /2000 =1.75bob
          const response=(Number((ingredient.quantity * savedIngredient.density) / 16) * Number(savedIngredient.packageCost)) /
            similarUnits
          return response;
        }
        if (ingredient.measure === "tsp"|| "tsps") {
          //tsp-> 1/tbsp= 1/3tbsp*200g/16=4.2g sugar  convert to tbsp( tsp/tbsptotsp)*density
          // sugar= 4.2g*170/1000= 0.7bob
          const response=(Number(((ingredient.quantity / 3) * savedIngredient.density) / 16) *
              Number(savedIngredient.packageCost)) /
            similarUnits
          return response;
        }
      } else if (
        //hybrid g vs ml
        //eg 80g buttermilk density=300g/cup  cost=90sh/500ml
        liquidpkgUnits.includes(savedIngredient.packageUnit) && solidWeightMeasures.includes(ingredient.measure)
        ) {
          const toCup = {
            litre: 0.25,
            litres: 0.25,
            ml: 240,
            mls: 240,
            cup: 1,
            cups: 1,
            gal: 1/16,
            gals: 1/16,
            "fl.oz": 8,
            tsp: 48,
            tsps: 48,
            tbsp: 16,
            tbsps: 16,
          };
          const toGrams = {
            oz: 28,
            kg: 1000,
            lb: 454,
            g: 1,
          };
          //change the packageunits to cup measure coz density is in cups = how many cups in a package
          //incups=pkgsize/toCups[pkgunits] ie 500ml/240=2.1cups
          //convert ingredient quantity measure to grams coz, density is in grams/cup
          //grammeasure=tograms[measure]*ing.qtty ... ie 1*80=80g
          //convert ingredient quantity in grams to cup
          //cupqtty=grammeasure/density, ie...density=300g/cup... 80/300=0.27cup
          //calculate cost of that ingredient cup amount given package cost and package size in cups
          //90sh=2.1cups: 0.27cup cupqtty*pkgcost/incups...o.27*90/2.1

          const similarUnits = savedIngredient.packageSize / toCup[savedIngredient.packageUnit];
          const gramMeasure= toGrams[ingredient.measure] *ingredient.quantity 
          const quantityInCups= gramMeasure/savedIngredient.density
          const response= Number(quantityInCups*savedIngredient.packageCost/similarUnits)
          return response
        }
    } else {
      console.log(' ingredient or package parameter missing');
    }
  };
  export const getFiles= async(dispatch, user)=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
        await axios.get(`https://bakepricely.onrender.com/api/user/getuser?userid=${user._id}`, config).then(async(res)=>{
          const result1=res.data.nofolderfiles
          await axios.get(`https://bakepricely.onrender.com/api/folder/allfolders?userid=${user._id}`, config).then((response)=>{
              let result2=[];
              for (let i=0; i<response.data.length;i++) {
                result2=result2.concat(response.data[i].files)
              }
              dispatch(fetchfilesSuccess([...result1,...result2]))
            })
          })
    } catch (error) {
      console.log(error);
      dispatch(fetchfilesFailure());
    }
  }
  export const getFolders=async( dispatch, user)=>{
    dispatch(fetchfoldersStart())
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
    //works
    await axios.get(`https://bakepricely.onrender.com/api/folder/allfolders?userid=${user._id}`, config).then(res=>{
      dispatch(fetchfoldersSuccess(res.data));
    })
  }
  export const getIngredients=async(dispatch, user)=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      dispatch(fetchingredientsStart())
        await axios.get(`https://bakepricely.onrender.com/api/ingredient`, config).then((res)=>{
          if(res.data) {
            dispatch(fetchingredientsSuccess(res.data))
          }
      })
      } catch (error) {
        console.log(error)
        dispatch (fetchingredientsFailure())
      }
}
