var router = require("express").Router();
var jwt = require("express-jwt");
var secret = require("../config/database").secret;

var profileHandler = require("./profile");
var resourcesHandler = require("./ressources");

router.use(jwt({secret}).unless({path: /view/}), (req, res, next) => {
    next();
});

router.use("/profile", profileHandler);
router.use("/resources", resourcesHandler);

module.exports = router;
