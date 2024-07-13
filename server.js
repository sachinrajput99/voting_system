const express = require("express"); // import
const app = express();
require("dotenv").config();
const db = require("./db"); //connecting to db

const bodyParser = require("body-parser"); //parses the information coming from http into req's body
app.use(bodyParser.json()); //req.body

//import the router file
const userRoutes = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoute");
// const candidateRoutes = require("./routes/candidateRoutes");
// use the router
app.use("/user", userRoutes);
app.use("/candidate", candidateRoutes);//operation related to candidate jo bi isko perform krega uska role admin hoga


// const PORT = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("server is running");
}); //started server on 3000:port
