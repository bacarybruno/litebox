var app = require("express")();

var Files_Coll = require("../Controllers/FilesController");

app
    .route("/")
    .post(Files_Coll.create_a_file);
app
    .route("/:fileId")
    .delete(Files_Coll.delete_a_file)
    .get(Files_Coll.read_a_file)
    .put(Files_Coll.update_a_file);
app
    .route("/:fileId/download/")
    .get(Files_Coll.download_a_file);
app
    .route("/:fileId/view/")
    .get(Files_Coll.view_a_file);

module.exports = app;