var router = require('express').Router();

var userHandler = require("./user");

router.use("/user", userHandler);

module.exports = router;
