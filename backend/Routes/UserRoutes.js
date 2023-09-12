const express= require ('express');
const { registerUser, updateUser, deleteUser, verifyUser, authUser, addFile, getUser } = require('../Controllers/UserController');
const verifyToken = require('../Controllers/VerifyToken');
const router= express.Router();
//userid=64c107ab658fea2f1aae4c8c
router.route("/newuser").post(registerUser);//signup
router.route("/getuser").get(getUser);
router.route("/newuser/verify").post(verifyUser);//validate confirmationcode
router.route("/authenticate").post(authUser);//login
router.route("/").put(verifyToken, updateUser);
router.route("/deleteuser").delete(verifyToken, deleteUser);
router.route("/newfile").put(verifyToken, addFile);

module.exports=router;