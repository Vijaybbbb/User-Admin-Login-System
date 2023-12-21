const collection = require("../Model/user")
const bcrypt=require("bcrypt")



async function login (req,res){
       try{  
              const check=await collection.findOne({email:req.body.email})
              const isPasswordMatch = check.password === req.body.password;
              if(isPasswordMatch){
                    if(check.is_admin === 0){
                           res.status(401).render("adminlogin",{message:"Not Admiin"});
                    }else{
                           req.session.admin=req.body.email
                           req.session.isAdmin = true
                           const usersData=await collection.find({is_admin:0})
                           res.redirect("/admin/adminDash")

                    }
              }
              else {
                     // Passwords do not match
                     res.status(401).render("adminlogin",{message:"Invalid password"});
               }
      }
      catch(error){
       console.error("Error during login:", error);
       res.status(500).send("Internal server error");
      } 
}

async function home (req,res){
       try {
              if (req.session.admin) {
                   var search="";
                   if(req.query.search){
                          search=req.query.search
                   }
     
                   const usersData = await collection.find({ 
                          is_admin: 0,
                          $or:[
                                 
                                 {fname:{$regex: '.*'+ search +'.*'}},
                                 {sname:{$regex: '.*'+ search +'.*'}},
                                 {email:{$regex: '.*'+ search +'.*'}},
                          ] 
                   
                   });
                   

                   res.render("adminDashboard", { users: usersData , search:search});
                  

              } else {
                res.redirect("/admin");
              }
            } catch (error) {
              console.error("Error retrieving user data:", error);
              res.status(500).send("Internal server error");
            }
}

async function logout (req,res){
//        req.session.destroy(function (err){
//               if(err){
//                      console.log(err);
//                      res.send("ERROR")
//               }else{
//                      res.redirect("/admin")
//               }
//        })
       if(req.session.admin){
              req.session.admin = null
              res.status(401).render("login",{message:"Logout Successfully"});
       }
 }

async function newUser (req,res){
       res.render("newUser")

}
async function addUser (req,res){
       try {
              const data={
                     fname:req.body.fname,
                     sname:req.body.sname,
                     email:req.body.email,
                     password:req.body.password
              }
              //check User exist OR not
              const existingUser=await collection.findOne({email:data.email})
              if(existingUser){
                    res.render('newUser',{message:"User Already Exist"})
              }
              else{  
                     const hashedPassword = await bcrypt.hash(data.password, 10);

                     // Replace plaintext password with the hashed password
                      data.password = hashedPassword;
                     const userdata= await collection.insertMany(data)
                     
                     res.redirect("/admin/adminDash")
              }

       } catch (error) {
         console.error("Error retrieving user data:", error);
         res.status(500).send("Internal server error");
       }
}


async function editUser (req,res){
       try {
              const id=req.query.id;
              const userdata= await collection.findById({_id:id})
              if(userdata){
                      res.render("editUser",{users:userdata})
              }else{
                      res.redirect("/admin/adminDash")
              }
        } catch (error) {
          console.error("Error retrieving user data:", error);
          res.status(500).send("Internal server error");
        }
}

async function modifyUser(req,res){
       try {
              const userdata = await collection.findByIdAndUpdate({_id:req.body.id},{$set:{fname:req.body.fname,sname:req.body.sname,email:req.body.email,password:req.body.password}})
              res.redirect("/admin/adminDash")
        } catch (error) {
          console.error("Error retrieving user data:", error);
          res.status(500).send("Internal server error");
        }
}

async function deleteUser(req,res){
       try {
              const id=req.query.id;
             const userdata = await collection.deleteOne({_id:id})
             res.redirect("/admin/adminDash")
       } catch (error) {
         console.error("Error retrieving user data:", error);
         res.status(500).send("Internal server error");
       }
}


module.exports = {
       login,
       home,
       logout,
       newUser,
       addUser,
       editUser,
       modifyUser,
       deleteUser
}