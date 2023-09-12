const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmationCode: {type: String, required: true},
    status: { type: String, enum: ['Pending', 'Active'], default: 'Active'},
    nofolderfiles: [
      {
        name: {type: String},
        servings: {type: Number},
        content: {type: String},
        LabourCost: {type: Number},
        LabourHours: {type: Number},
        Overheads: {type: Number},
        Profit: {type: Number},
      },
    ],
  },
  { timestamps: true,
    toJSON: {virtuals: true} }
);
const User=mongoose.model("User", UserSchema);

module.exports = User;