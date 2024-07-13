const express = require("express"); // import
const User = require("../models/user");
const router = express.Router(); //router is like traffic cop
const { jwtAuthMiddleware, generate, generateToken } = require("../jwt");
const Candidate = require("../models/candidate");

const checkAdminRole=async(userID)=>{
  try{
    const user=await User.findById(userID)//user is candidate
    // console.log(user);
    return user.role==="admin"//checking if user is admin or not

  }catch(err){
    return false;
  }
}


//POST route to add a candidate
router.post("/", jwtAuthMiddleware,async (req, res) => {
  try {
    // if(!await checkAdminRole(req.user.id)){//req.user=decoded token value
    if(!await checkAdminRole(req.user.userData.id)){//req.user=decoded token value
      return res.status(403).json({message:"user has no admin role"})
    }

    const data = req.body; //assuming the data is in candidate body

    const newCandidate = new Candidate(data); //creating new user based on user model
    const response = await newCandidate.save(); //saving new user to data base

    console.log("data saved");

    res.status(200).json({ response: response }); //sending response to user
  } catch (error) {
    console.log(err);
    req.status(500).json({ error: "Internal Server Error" }); //sending error message in case of error
  }
});





router.put("/:candidateID", jwtAuthMiddleware,async (req, res) => {
  try {
    if(!checkAdminRole(req.user.userData.id)){//req.user=decoded token value
      return res.status(403).json({message:"user has no admin role"})
    }

    const candidateId = req.params.candidateID; //extract the id from url params
    console.log(req.params);
    const updatedCandidateData = req.body; //updated data from person

    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true, //run the updated document
        runValidators: true, //run mongoose validation
      }
    );
    if (!response) {
      return res.status(403).json({ error: "candidate not found" });
    }
    console.log("candidate data updated");
    res.status(200).json(response);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.delete("/:candidateID", jwtAuthMiddleware,async (req, res) => {
  try {
    if(!checkAdminRole(req.user.userData.id)){//req.user=decoded token value
      return res.status(403).json({message:"user has no admin role"})
    }

    const candidateId = req.params.candidateID; //extract the id from url params
    const updatedCandidateData = req.body; //updated data from person

    const response = await Candidate.findByIdAndDelete(
      candidateId,
      updatedCandidateData,
      {
        new: true, //run the updated document
        runValidators: true, //run mongoose validation
      }
    );
    if (!response) {
      return res.status(403).json({ error: "candidate not found" });
    }
    console.log("candidate deleted");
    res.status(200).json({message:"candidate deleted"});

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post("/vote/:candidateID",jwtAuthMiddleware,async (req,res)=>{
  // no admin can wait 
  const candidateId = req.params.candidateID; //extract the id from url params

  const userId=req.user.userData.id;
  try{
  const candidate=await Candidate.findById(candidateId)//user is candidate
  console.log(candidate);
  if( !candidate)//checking if user is admin or not
  {
    return res.status(404).json({error:"candidate cannot be found"})
  }

  const user=await User.findById(userId)//user is candidate

  if( !user)//checking if user is admin or not
  {
    return res.status(404).json({error:"user cannot be found"})
  }
  //user can only vote once
    if(user.isVoted){
      res.status(404).json({message:"you have already voted"})
    }
    if (user.role==="admin"){
       res.status(403).json({message:"admin is not allowed"})
    }

    // update the candidate document to the vote
    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();


    // update the user document
    user.isVoted=true;
    await user.save();
    res.status(200).json({message:"Vote recorded successfully"})
  }catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server error"})

  }
})
router.get("/vote/count", async(req,res)=>{
  try{
    // Find all the candidate and sort them by vote count
    const candidate=await Candidate.find().sort({voteCount:"desc"});
    // Map the candidates to only return their name and voteCount
    const voteRecord= candidate.map((data)=>{
      return{
        party:data.party,
        count:data.voteCount
      }
    })
    return res.status(200).json(voteRecord);
  }catch(err){ console.log(err);
    res.status(500).json({error:"Internal server error"})
}
})

router.get("/list", async (req, res) => {
  try {
    const data = await Candidate.find();
    console.log("data fetched");
    res.status(200).json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server  error" });
  }
});
module.exports = router;
