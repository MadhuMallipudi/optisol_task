const express = require('express');
const router = express.Router();
const usersRoutes =  require("./userRoutes")

router.use("/optisol",usersRoutes);

module.exports = router;

