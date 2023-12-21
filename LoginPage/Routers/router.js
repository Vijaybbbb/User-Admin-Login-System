const express=require("express")
const router=express.Router()
const session=require("express-session")
const collection = require("../mongodb")
const { render } = require("../app")
const adminRouter = require("./adminrouter")
const bcrypt=require("bcrypt")
const {login,
       invalid,
       submit,
       signup,
       userHome,
       userLogout,
      
} = require("../Controllers/user")


//cache clearing 
router.use((req, res, next) => {
       res.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
       res.header('Pragma', 'no-cache');
       next();
     });
  
     

router.get("/",(req,res)=>{
       if(req.session.user){
              res.redirect("/home")
       }
       else{
              res.render("login")
       }
})

 
router.post("/login",login)

router.get("/invalid",invalid)


//User Submit Page
router.get("/sign",submit)

router.post("/signup",signup)

//User Home Page
router.get("/home",userHome)

//User Logout Page
router.get("/logout",userLogout)



 
module.exports=router