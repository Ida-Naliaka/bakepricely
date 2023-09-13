const express= require ("express");
const mongoose= require("mongoose");
const cors= require("cors");
const userRoutes = require("./Routes/UserRoutes");
const ingredientRoutes = require("./Routes/IngredientRoutes");
const folderRoutes = require("./Routes/FolderRoutes");
const { notFound, errorHandler } = require("./Middleware/ErrorMidleware");
const path = require("path");
const runner= require('../test-runner');
require ("dotenv").config;

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use("/api/user", userRoutes);
  app.use("/api/ingredient", ingredientRoutes);
  app.use("/api/folder", folderRoutes);
  app.use(notFound);
  app.use(errorHandler);
  const port = process.env.PORT || 5000;
  db().then(() => {
    //Start our server and tests!
    const listener = app.listen(port,  ()=>{
      console.log('Server started on port ' + listener.address().port);
      if(process.env.NODE_ENV==='test') {
        console.log('Running Tests...');
        setTimeout(function () {
          try {
            runner.run();
          } catch(e) {
              console.log('Tests are not valid:');
              console.error(e);
          }
        }, 1500);
      }
    });
  });
  console.log("API is running successfully..");

module.exports = app;//for testing