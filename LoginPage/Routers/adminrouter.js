const express=require("express")
const adminRouter=express.Router()
const session=require("express-session")
const collection = require("../mongodb")
const { render } = require("../app")
adminRouter.use(express.static(__dirname + '../Static'));
const bcrypt=require("bcrypt")
const app = require("../app")
const {login,
       home,
       logout,
       newUser,
       addUser,
       editUser,
       modifyUser,
       deleteUser

} = require('../Controllers/admin')


 
//cache clearing 
adminRouter.use((req, res, next) => {
       res.header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
       res.header('Pragma', 'no-cache');
       next();
     });
// Session Checking Middleware 
function checkSession(req, res, next) {
       if (!req.session.admin && req.session.isAdmin) {
         res.redirect('/admin');
       } else {
         next();
       }
     }


     
// Apply session checking middleware to routes that require authentication
adminRouter.use(['/adminDash', '/addnewUser', '/edituser', '/modifyuser', '/deleteuser'], checkSession);

adminRouter.get("/",(req,res)=>{
       
       if(req.session.admin ){
              res.redirect("/admin/adminDash")
       }
       else{
              res.render("adminlogin")
       }
}) 

//Admin Login
adminRouter.post("/adminLogin",login)
 
 // Admin Home Page
adminRouter.get("/adminDash",home);

//Admin Logout 
adminRouter.get("/adminLogout",logout)

//Add New User
adminRouter.get("/addnewUser",newUser)

adminRouter.post("/adminAdd", addUser);

//Edit User
adminRouter.get("/edituser", editUser);

//Modify Edited Details
adminRouter.post("/modifyuser", modifyUser);

//Deleting User
adminRouter.get("/deleteuser", deleteUser);


module.exports=adminRouter