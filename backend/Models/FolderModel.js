const mongoose = require("mongoose");

const FolderSchema = new mongoose.Schema(
  {
    userid: { type: String, required: true },
    name: { type: String, required: true, unique: true },
    files: [
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
    toJSON: {virtuals: true}
   }
);
const Folder=mongoose.model("Folder", FolderSchema);

module.exports = Folder;