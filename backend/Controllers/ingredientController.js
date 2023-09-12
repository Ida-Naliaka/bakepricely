const Ingredient = require("../Models/IngredientModel");
const expressAsyncHandler= require('express-async-handler');

//CREATE
const createIngredient = expressAsyncHandler(async(req, res) => {
  const {userid, name, density, packageCost, packageSize, packageUnit,packageContents} = req.body;
  if (!userid ||!name || !packageCost || ((!density  || !packageSize || !packageUnit) && !packageContents)) {
    res.status(400)
    console.log("no ingrediet sent");
    throw new Error("no input sent")
  }
  try {
    const ingredient = await Ingredient.findOne({name:name});
    if(ingredient) {
      res.status(200).json(ingredient);
    } else {
    const CreatedIngredient= await Ingredient.create({
      userid:userid,
      name: name.toLowerCase(),
      density:density,
      packageCost:packageCost,
      packageSize:packageSize,
      packageUnit:packageUnit,
      packageContents:packageContents,
    });
    if (CreatedIngredient) {
      res.status(201).json(CreatedIngredient)
    } else {
      console.log('no ingredient created in db');
    }
  }
  } catch (error) {
    console.log(error)
  }
});

//UPDATE
const updateIngredient = expressAsyncHandler( async(req, res) => {
    const {userid, name, density, packageCost, packageSize, packageUnit, packageContents} = req.body;
    const ingredient={
    userid:userid,
    name: name.toLowerCase(),
    density:density,
    packageCost:packageCost,
    packageSize:packageSize,
    packageUnit:packageUnit,
    packageContents:packageContents}

  if (!userid && !name && !density && !packageCost && !packageSize && !packageUnit && !packageContents) {
    res.status(400)
    throw new Error("no input sent")
  } 
  try {
    const updatedIngredient = await Ingredient.findByIdAndUpdate(
      req.params.ingredientid,
      {
        $set: ingredient,
      },
      { new: true }
    );
    res.status(200).json(updatedIngredient);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//DELETE
const deleteIngredient = expressAsyncHandler(async(req, res) => {
  try {
    await Ingredient.findByIdAndDelete(req.params.ingredientid);
    res.status(200).send("Ingredient has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET one ingredient
const getIngredient = expressAsyncHandler(async(req, res) => {
  try {
    const ingredient = await Ingredient.findOne({name:req.params.name});
    res.status(200).json(ingredient);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//GET ALL ingredients
const getAllIngredients = expressAsyncHandler(async(req, res) => {
  try {
    let ingredients;
      ingredients = await Ingredient.find();
       res.status(200).json(ingredients);
    } catch (err) {
    res.status(500).json(err);
  }
});
//get searched ingredients
const searchIngredients = expressAsyncHandler(async (req, res) => {
  const ingredients = await Ingredient.find({$or: [
      { name: { $regex: req.query.search, $options: "i" } },
  ],
  })
  res.send(ingredients);
      
  });
  

module.exports = { createIngredient, updateIngredient, deleteIngredient, getIngredient, getAllIngredients, searchIngredients };