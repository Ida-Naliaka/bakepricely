const Folder = require("../Models/FolderModel");
const User = require("../Models/UserModel");
const expressAsyncHandler= require('express-async-handler');

//CREATE
const createFolder = expressAsyncHandler(async(req, res) => {
  const {userid, name} = req.body;
  if (!userid ||!name) {
    res.status(400)
    throw new Error("no input sent")
  }
  const CreatedFolder= await Folder.create({
    userid:userid,
    name: name,
    files:[],
  });
  if (CreatedFolder) {
    res.status(201).json(
     {  _id: CreatedFolder._id,
        userid: CreatedFolder.userid,
        name: CreatedFolder.name,
        files: CreatedFolder.files,
    })
  } else {
    console.log('no folder created in db');
  }
});

//UPDATE to add file
const addFile = expressAsyncHandler(async(req, res) => {
    const {fileName, servings, fileContent, LabourCost, LabourHours, Overheads, Profit} = req.body;
  const newFile={
    name: fileName,
    servings: servings,
    content: fileContent,
    LabourCost: LabourCost,
    LabourHours:LabourHours,
    Overheads:Overheads,
    Profit:Profit,
};

  if (!fileName && !servings && !fileContent && !LabourCost && !LabourHours && !Overheads && !Profit) {
    res.status(400)
    throw new Error("no input sent")
  } 
  try {
    const updatedFolder = await Folder.findByIdAndUpdate(
      req.query.folderid,
      {$push: { files: newFile }},
      { new: true }
    );
    res.status(200).json(updatedFolder);
} catch (err) {
    res.status(500).json(err);
}
});

//UPDATE to edit existing file
const updateFileContent = expressAsyncHandler(async(req, res) => {
  const {content, name, servings, LabourCost, LabourHours, Overheads, Profit} = req.body;
  const userId = req.query.userid;
  const fileId = req.query.fileid;
if ((!userId || !fileId) || (!content.length && !name.length && !servings && !LabourCost && !LabourHours && !Overheads  && !Profit)) {
  res.status(400)
  throw new Error("no input sent")
} else{
const inFolder= await Folder.find({files:{$elemMatch:{_id :fileId}}});
const inUser= await User.find({nofolderfiles:{$elemMatch:{_id :fileId}}});
try {
  if(inFolder.length) {
    const updatedFolderFile = await Folder.findOneAndUpdate(
      {userid: userId, "files._id": fileId },
      { $set: {"files.$.content": req.body.content,
      "files.$.name": name,
      "files.$.servings": servings,
      "files.$.LabourCost": LabourCost,
      "files.$.LabourHours": LabourHours,
      "files.$.Overheads": Overheads,
      "files.$.Profit": Profit}},
    {new : true}
      )
      res.status(200).json(updatedFolderFile);
    } else if(inUser.length) {
      
      const updatedUserFile = await User.findOneAndUpdate(
        {_id: userId, "nofolderfiles._id": fileId },
        { $set: { "nofolderfiles.$.content": req.body.content,
        "nofolderfiles.$.name": name,
        "nofolderfiles.$.servings": servings,
        "nofolderfiles.$.LabourCost": LabourCost,
        "nofolderfiles.$.LabourHours": LabourHours,
        "nofolderfiles.$.Overheads": Overheads,
        "nofolderfiles.$.Profit": Profit,} },
        {new : true}
        );
        res.status(200).json(updatedUserFile);
      }
} catch (err) {
  console.log(err);
  res.status(500).json(err);
}
}
});

//DELETE
const deleteFolder = expressAsyncHandler(async(req, res) => {
  try {
    await Folder.findByIdAndDelete(req.query.folderid);
    res.status(200).send("Folder has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});
//Delete file
const deleteFile = expressAsyncHandler(async(req, res) => {
  const userId = req.query.userid;
  const fileId = req.query.fileid;
if (!userId || !fileId) {
  res.status(400)
  throw new Error("no input sent")
} 
try {
  const inFolder= await Folder.findOne({files:{$elemMatch:{_id :fileId}}});
  const inUser= await User.findOne({nofolderfiles:{$elemMatch:{_id :fileId}}});
  if(inFolder) {
    const deleteFromFolder =await Folder.findOneAndUpdate(
      {files:{$elemMatch:{_id :fileId}}},
      {$pull: {files: {_id: fileId}}},
      );
    if(deleteFromFolder) {
      res.status(200).send('file deleted from Folder');
    }
    } else if (inUser) {      
      const deleteFromUser=await User.findOneAndUpdate(
        {nofolderfiles:{$elemMatch:{_id :fileId}}},
        {$pull: {nofolderfiles: {_id: fileId}}},
        );
      if(deleteFromUser) {
        res.status(200).send('file deleted from User');
      }
      }
} catch (err) {
  console.log(err);
  res.status(500).json(err);
}
});
//GET Folder
const getFolder = expressAsyncHandler(async(req, res) => {
  try {
    const folder = await Folder.findById(req.query.folderid);
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL folders
const getAllFolders = expressAsyncHandler( async(req, res) => {
  try {
    let folders;
      folders = await Folder.find({userid: req.query.userid});
       res.status(200).json(folders);
    } catch (err) {
    res.status(500).json(err);
  }
});

const searchFolders = expressAsyncHandler(async (req, res) => {
  const folders = await Folder.find(
    {$or: [{ name: { $regex: req.query.search, $options: "i" } }]}
    )
    res.send(folders);
  });
  

module.exports = { createFolder, addFile, deleteFolder,deleteFile, getFolder, getAllFolders, searchFolders, updateFileContent };