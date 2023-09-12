const express= require ('express');
const { createFolder, addFile, deleteFolder, getAllFolders, getFolder, searchFolders, updateFileContent, deleteFile } = require('../Controllers/FolderController');
const verifyToken = require('../Controllers/VerifyToken');
const router= express.Router();
//const { createCart, updateCart, deleteCart, getUserCart, getAllCarts } = require('../Controllers/CartController');

router.route("/").post(verifyToken, createFolder);
router.route("/allfolders").get(verifyToken, getAllFolders);
router.route("/").put(verifyToken, addFile);
router.route("/editfilecontent").put(verifyToken, updateFileContent);
router.route("/deletefile").delete(verifyToken, deleteFile);
router.route("/").delete(verifyToken, deleteFolder);
router.route("/findfolder").get(verifyToken, getFolder);
router.route("/search").get(verifyToken, searchFolders);
module.exports=router;