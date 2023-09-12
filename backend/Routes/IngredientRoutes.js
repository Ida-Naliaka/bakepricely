const express= require ('express');
const { createIngredient, updateIngredient, deleteIngredient, getAllIngredients, getIngredient, searchIngredients } = require('../Controllers/ingredientController');
const verifyToken = require('../Controllers/VerifyToken');
const router= express.Router();

router.route("/").post(verifyToken, createIngredient);
router.route("/").get(verifyToken, getAllIngredients);
router.route("/:name").get(verifyToken, getIngredient);
router.route("/search").get(verifyToken, searchIngredients);
router.route("/:ingredientid").put(verifyToken, updateIngredient);
router.route("/:ingredientid").delete(verifyToken, deleteIngredient);

module.exports=router;