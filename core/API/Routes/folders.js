var app = require("express")();

var Folders_Coll = require("../Controllers/FoldersController");

app
    .route("/")
    .post(Folders_Coll.create_a_folder)
app
    .route("/:folderId")
    .delete(Folders_Coll.delete_a_folder)
    .put(Folders_Coll.update_a_folder)
app
    .route("/:folderId/download")
    .get(Folders_Coll.download_a_folder)

module.exports = app;
