const {collection} = require('../Model/user')
const bcrypt=require("bcrypt")

async function login (req,res){
       try{  
              const check=await collection.findOne({email:req.body.email})
              if(!check){
                     res.status(401).render("login",{message:"User Not Found"});
                     
              }
             else{
              //const isPasswordMatch = check.password === req.body.password;
              const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
              if(isPasswordMatch){
                     req.session.user=req.body.email
                    
                     req.session.fname = check.fname
                     console.log(req.session.fname);
                     res.redirect("/home")
              }
              else {
                     res.redirect("/invalid")
               }
             }
      }
      catch(error){
       console.error("Error during login:", error);
       res.status(500).send("Internal server error");
      } 
}

function invalid(req,res){
       if(req.session.user){
              res.redirect("/home")
        }
        else{
              res.status(401).render("login",{message:"Invalid Password"});
        }
}
function submit(req,res){
       if(req.session.user){
              res.redirect("/home")
       }
       else{
              res.render("signup")
       }
}




async function signup(req,res){
       const data={
              fname:req.body.fname,
              sname:req.body.sname,
              email:req.body.email,
              password:req.body.password,
              retypePassword:req.body.retypePassword,
              is_admin:0

       }
       //check User exist OR not
       const existingUser=await collection.findOne({email:data.email})
       if(existingUser){
              res.status(401).render("signup",{message:"Mail Already Exist"});
       }
       else if(data.password != data.retypePassword){     
              res.status(401).render("signup",{message:"Password Do not Match"});
       }
       else{  
              const hashedPassword = await bcrypt.hash(data.password, 10);

              // Replace plaintext password with the hashed password
              data.password = hashedPassword;
              const userdata= await collection.insertOne(data)
              req.session.user=req.body.email
              res.redirect("/home")
       }
}

async function userHome(req,res){
       try {
              const check = await collection.findOne({ email: req.session.user });
              
              if (!check) {
                  res.redirect("/logout")
              } else {
                     res.render("home",{user:req.session.user , name:req.session.fname})
              }
            } catch (error) {
              console.error("Error checking email existence:", error);
              res.status(500).send("Internal server error");
         }

}

function userLogout(req,res){
//        req.session.destroy(function (err){
//               if(err){
//                      console.log(err);
//                      res.send("ERROR") 
//               }else{
//                      res.status(401).render("login",{message:"Logout Successfully"});
//               }
//        })
       if(req.session.user){
              req.session.user = null
              res.status(401).render("login",{message:"Logout Successfully"});
       }
 }




module.exports = {
       login,
       invalid,
       submit,
       signup,
       userHome,
       userLogout,
       
}