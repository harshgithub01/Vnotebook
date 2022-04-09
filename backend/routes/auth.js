const express = require('express');

const User = require('../models/User');
const router = express.Router();
const {body, validationResult}  = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt =require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "ayushkumar";
// route 1
router.post('/createUser',[
    body('name','enter valid name').isLength({min:3}),
    body('email','eneter valid email').isEmail(),

    body('password','enter valid pass').isLength({min:5})
],async (req,res)=>{
  let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array()});
    }
    try{
   let user =await User.findOne({email:req.body.email});

   if(user){
       return res.status(400).json({success,error:"sorry user exist"});
   }
   const salt = await bcrypt.genSalt(10);
   const secPass = await bcrypt.hash(req.body.password,salt);
   user = await User.create({
        name: req.body.name,
      
        password: secPass,

        email: req.body.email,
      });
      
    //   .then(user => res.json(user))
    //   .catch(err => console.log("err"));
    
  
//    res.send(req.body);
const data = {
  user:{
    id:user.id
  }
}
const authtoken = jwt.sign(data, JWT_SECRET);
success =true
res.json({success, authtoken});
    }
    catch(error)
{
  console.error(error.message);
  res.status(500).send("some error occurred");
}
})

// ROUTE 2
router.post('/login',[
  body('email','eneter valid email').isEmail(),
  body('password','enter valid pass').exists(),
],async(req,res)=>{
let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
const{email, password} = req.body;
try{
  let user  = await User.findOne({email});
  if(!user)
  {
    return res.status(400).json({error:"invalid"});

  }
const passwordCompare = await bcrypt.compare(password, user.password);
if(!passwordCompare)
{
  success= false;
  return res.status(400).json({success, error:"invalid"});
}
const data = {
  user:{
    id:user.id
  }
}
const authtoken = jwt.sign(data, JWT_SECRET);
success = true;
res.json({success,authtoken});
}
catch(error)
{
  console.error(error.message);
  res.status(500).send("internal some error occurred");
}
})

// Route 3
router.post('/getuser',fetchuser, async(req,res)=>{
  
try{
  userId =req.user.id;

const user  = await User.findById(userId).select("-password")
res.send(user)
}
catch(error)
{
  console.error(error.message);
  res.status(500).send("internal some error occurred");
}
})

module.exports = router;