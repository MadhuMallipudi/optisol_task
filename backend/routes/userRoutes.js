const express = require("express");
const userRouter =  express.Router();
const userCtrl =  require("../controllers/users.controller");

userRouter.route("/create").post(userCtrl.create);
userRouter.route("/list").get(userCtrl.list);
userRouter.route("/getById").get(userCtrl.getById);
userRouter.route("/update").put(userCtrl.updateList);
userRouter.route("/delete").delete(userCtrl.deleteList);


module.exports = userRouter;  
