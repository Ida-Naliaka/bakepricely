const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");
const dotenv = require("dotenv");
dotenv.config();
const expressAsyncHandler = require("express-async-handler");

const verifyToken = expressAsyncHandler(async (req, res, next) => {
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; //split it and take the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);//decodes token id
      req.user = await User.findById(decoded.id).select("-password"); //return without the password
      next();
    } catch (error) {
     // console.log(error);
      res.status(401);
      throw new Error("Not Authorized, Token is not valid!");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("You are not authenticated!");
  }
});

module.exports = verifyToken;