 const mongoose=require("mongoose")
 const connect=mongoose.connect("mongodb://localhost:27017/loginandsignup")

connect.then(()=>{
       console.log("Database connected Successfuly");
})
.catch(()=>{
       console.log("Failed to connect");
})


