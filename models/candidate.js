const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//creating schema of our model
const candidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  
  party: {
    type: String,
    required:true,
  }, 
  age: {
    type: Number,
    required:true,
   
  },
  votes:[
    {user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true
    },
    votedAt:{type:Date,
        default:Date.now()

    }}
],
voteCount:{
    type:Number,
    default:0
}
  
});


//create person model
const Candidate = mongoose.model("Candidate", candidateSchema);
module.exports = Candidate; //exporting model
