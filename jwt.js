const jwt=require("jsonwebtoken");

const jwtAuthMiddleware = (req,res,next)=>{

    // first check request headers has authorization or not
    // as req.headers.authorization contains our token

    const authorization =req.headers.authorization;
    //  if authorizations is not present then
    if(!authorization) return res.status(401).json({error:"Token not found"})

    // extract JWT token from request headers(postman se bhejenge)

    const token=req.headers.authorization.split(' ')[1];//token =Bearer qwertyuio=>qwertyuio
//    agr token ni hai to=>
    if(!token) return res.status(401).json({error:"Unauthorized"})
//    agr token hai to=>
        try{
            // verify the JWT token
            const decoded=jwt.verify(token,process.env.JWT_SECRET);//decoded =token-secret=payload

            // Attach user information to the request object
            // req.userPayload=decoded;
            // req.user=payload;
            req.user=decoded;// req.user = original data
            // console.log("req.user=",req.user);
            // console.log("req.user.userData=",req.user.userData);
            // console.log("req.user.userData.id=",req.user.userData.id);
            next();
        }catch(err){
            console.error(err);
            res.status(401).json({error:"Invalid token"})

        }
}

//function to generate JWT token
const generateToken=(userData)=>{// userData usually contains {username , password} 

    //Generating a JWT token using userData
    return jwt.sign({userData},process.env.JWT_SECRET,{expiresIn:3000000})

}



module.exports={jwtAuthMiddleware,generateToken};