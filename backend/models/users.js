const mongoose = require("mongoose");

const addressSchema =  new mongoose.Schema({
    address_line1:{
        type:String
    },
    address_line2:{
        type:String
    },
    city:{
        type:String
    },
    zipcode:{
        type:String
    },
    state:{
        type:String
    },
    country:{
        type:String
    }
 });
const userSchema =  new mongoose.Schema({
    first_name:{
        type:String
    },
    last_name:{
        type:String
    },
    email:{
        type:String
    },
    phone_number:{
        type:Number
    },
    address:[addressSchema],
    qualification:{
        type:Array
    },
    comments:{
        type:String
    },
    is_active:{
        type:Boolean,
        default:1
    },
    status:{
        type:Boolean,
        default:1
    }

});

module.exports = mongoose.model("users",userSchema);


