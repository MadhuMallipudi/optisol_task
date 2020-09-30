const express = require("express");
const app = express();
const cors =  require("cors");
const bodyParser = require("body-parser");
const db =  require("./connection");
let {port}  =  require("./config");

// import routes
const indexRoute =  require("./routes/index");

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());

app.use("/",indexRoute);

port = port || 5000;

app.listen(port,()=>{
    console.log(`server running on ${port} port`);
})