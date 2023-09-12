const User = require("../Models/UserModel");
const Folder = require("../Models/FolderModel");
const Ingredient = require("../Models/IngredientModel");
const bcrypt= require('bcryptjs')
const expressAsyncHandler= require('express-async-handler');
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
require("dotenv").config();

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
//register user
const registerUser = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password ) {
    res.status(400);
    throw new Error("Please fill in all the Fields");
  }
  const characters ="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let confirmationCode = "";
  for (let i = 0; i < 25; i++) {
    confirmationCode +=characters[Math.floor(Math.random() * characters.length)];
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password, 8),
    confirmationCode,
  });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
    });
    /*
    let mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: user.email,
      subject: "Please confirm your account",
      html: `<h1>Email Confirmation</h1>
      <h2>Hello ${user.name}</h2>
      <p>Thank you for signing up to BakePricely. Please confirm your email by clicking on the following link</p>
      <a href=http://localhost:3000/auth/${user.confirmationCode}> Click here</a>
      </div>`
    };
    transporter.sendMail(mailOptions, function (err, data) {
      if (err) {
        console.log("Error " + err);
      } else {
        console.log("Email sent successfully");
      }
    });*/
    res.redirect("/login");
  } else {
    throw new Error("Failed to create user");
  }
});

//verify confirmationcode sent

const verifyUser = expressAsyncHandler(async (req, res) => {
  User.findOne({ confirmationCode: req.params.confirmationCode })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
});
//login handler
const authUser = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all the Fields");
  }
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    if (user.status != "Active") {
      res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    } else {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        nofolderfiles: user.nofolderfiles,
        status: "Active",
        token: generateToken(user._id),
      });
    }
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});
//get user
const getUser = expressAsyncHandler( async(req, res) => {
  if(req.query.userid){
  try {
    const user = await User.findById(req.query.userid);
    if (user){
    res.status(200).json(user);
  }
  } catch (err) {
    res.status(500).json(err);
  }
}
});

//change password
//UPDATE
const updateUser = expressAsyncHandler( async(req, res) => {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(password, 8);
    }
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.query.userid,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  });
  
  //DELETE User
  const deleteUser = expressAsyncHandler(async(req, res) => {
    try {
      const deletedUser=await User.findByIdAndDelete(req.query.userid)
       const deletedFolders= await Folder.deleteMany({userid:req.query.userid})
        const deletedIngredients= await Ingredient.deleteMany({userid:req.query.userid})
       if(deletedUser && deletedFolders && deletedIngredients ){
        res.status(201).send("User has been deleted...");
       }
    } catch (err) {
      res.status(500).json(err);
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
    const updatedFile = await User.findByIdAndUpdate(
      req.query.userid,
      {$push: { nofolderfiles: newFile }},
      {new:true},
    ); 
    if (updatedFile){
    res.status(200).json(updatedFile);
  }
} catch (err) {
    res.status(500).json(err);
}
});

  

module.exports = {
  registerUser,
  verifyUser,
  authUser,getUser, updateUser, deleteUser,
 addFile
};