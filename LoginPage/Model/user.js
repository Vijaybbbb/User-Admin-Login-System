const mongoose=require("mongoose")


const LoginSchema=new  mongoose.Schema({
       fname:{
              type:String,
              required:true
       },
       sname:{
              type:String,
              required:true
       },
       email:{
              type:String,
              required:true
       },
       password:{
              type:String,
              required:true
       },
       is_admin:{
              type:Number,
              default:0
       }
})

const collection = new mongoose.model("Users",LoginSchema)

module.exports=collection