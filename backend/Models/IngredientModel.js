const mongoose = require("mongoose");

const IngredientSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    density: { type: String},
    packageCost: { type: Number},
    packageSize: { type: Number },
    packageUnit: { type: String },
    packageContents: { type: Number},
  },
  { timestamps: true,
    toJSON: {virtuals: true} }
);
const Ingredients=mongoose.model("Ingredients", IngredientSchema);

module.exports = Ingredients;