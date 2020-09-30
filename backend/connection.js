const mongoose = require("mongoose");

const connection = mongoose.connect("mongodb://localhost:27017/crud",{ useNewUrlParser: true },(err)=>{
    if(err){
        console.log(`something went wrong with db ${err} `);
    } else {
        console.log(`connection successfull with db `);
    }
});

module.exports = connection;
