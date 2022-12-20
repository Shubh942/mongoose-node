const mongoose = require("mongoose");
const validator=require('validator');
const bcrypt=require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please tell us your name'],
        },
        email:{
            type:String,
            required:[true,'Please provide us your Email'],
            unique:true,
            lowercase:true,
            validate:[validator.isEmail,'Please provide valid Email']
        },
        photo:{
            type:String,
        },
        password:{
            type:String,
            required:[true,'Please provide your password'],
            minlength:8
        },
        confirmPassword:{
            type:String,
            required:[true,'Please confirm your password'],
            validate:{
                validator: function(el){
                    return el===this.password;
                },
                message:'Password and Confirm Password  are not same'
            }
        }

    }
);

userSchema.pre('save',async function(){
    if (!this.isModified('password')) {
        return next();
    }
    this.password=await bcrypt.hash(this.password,12); 
    this.confirmPassword=undefined
})

const User=mongoose.model('User',userSchema);
module.exports=User;
