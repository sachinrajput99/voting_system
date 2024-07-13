const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//creating schema of our model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  mobile: {
    type: String,
  },
  email: {
    type: String,
  },
  address: {
    type: String,
    required:true,
  }, 
  aadharCardNumber: {
    type: String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  role:{
    type:"String",
    enum:["voter","admin"],
    default:"voter"
  },
  isVoted:{
    type:Boolean,
    default:false
  }
});

//password hashing
userSchema.pre("save", async function (next) {
    const person = this;
  
    //Hash the password only if it has been modified(or its new)
    if (!person.isModified("password")) return next();
  
    try {
      // hash password generation
      const salt = await bcrypt.genSalt(10);
      // hash password
      const hashedPassword = await bcrypt.hash(person.password, salt);
      // overwrite plain password with the hash one
      person.password = hashedPassword;
      next(); //next function batata h mongoose ko ki ab db m ja kr save krdo
    } catch (err) {
      return next(err);
    }
  });
  
  // making comparePassword function available  for comparing the password in database and user user provided password (through url)
  userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
      // Use bcrypt to compare the provide password with the hashed password
      const isMatch = await bcrypt.compare(candidatePassword, this.password);
      return isMatch;
    } catch (err) {
      throw err;
    }
  };
  

//create person model
const User = mongoose.model("User", userSchema);
module.exports = User; //exporting model
