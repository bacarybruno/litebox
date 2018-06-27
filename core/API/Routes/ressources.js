var router = require('express').Router();

var filesHandler = require("./files");
var foldersHandler = require("./folders");

var get_childrens = require("../Controllers/FoldersController").get_childrens;

router.use("/file", filesHandler);
router.use("/folder", foldersHandler);

// list all childrens of a folder
router.get('/:folderId', get_childrens);

module.exports = router;
