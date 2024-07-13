const express = require("express"); // import
const User = require("./../models/user");
const router = express.Router(); //router is like traffic cop
const { jwtAuthMiddleware, generate, generateToken } = require("../jwt");


// //see all user
// router.get("/menu", async (req, res) => {
//   try {
//     const data = await User.find();
//     console.log("data fetched");
//     res.status(200).json(data);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "Internal server  error" });
//   }
// });
//POST route to add a user
router.post("/signup", async (req, res) => {
  try {

    // const admin=await User.find({role:"admin"})
   
    const data = req.body; //assuming the data is in req's body


    // if (admin && data.role === "admin") {
    //   return res.status(403).json({ error: "An admin already exists. You cannot register another admin." });
    // }


    const newUser = new User(data); //creating new user based on user model
    const response = await newUser.save(); //saving new user to data base

    console.log("data saved");

    const payload = { id: response.id };
    // generating Token

    const token = generateToken(payload);
    // console.log("Token is:", payload);

    res.status(200).json({ response: response, token: token }); //sending response to user
  } catch (error) {
    console.log(err);
    req.status(500).json({ error: "Internal Server Error" }); //sending error message in case of error
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    // Extract aadharCardNumber and password from request  body
    const { aadharCardNumber, password } = req.body;

    // Find the user by aadharCardNumber
    const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

    // /If user does not exist or password doesnt match
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // generate Token
    const payload = {
      id: user.id,
      username: user.username,
    };
    // creating token from payload
    const token = generateToken(payload);

    // return json as response
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// profile route

router.get("/profile",jwtAuthMiddleware,async(req,res)=>{
  try{
    const userData=req.user;
    // console.log("User Data:",userData);

    const userId=userData.id;
    const user=await User.findById(userId);

    res.status(200).json({user});
  }catch(err){
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }

})



router.put("/profile/password", jwtAuthMiddleware,async (req, res) => {
  try {
    const userId = req.user; //extract the id from token
    const {currentPassword,newPassword} = req.body; //update data from person

    const user = await User.findById(userId);

    
    // /If user does not exist or password doesnt match
    if (!(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
  //  Update the user's password
    user.password=newPassword;
    await user.save();

    console.log("password updated");
    res.status(200).json({message:"Password updated"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
