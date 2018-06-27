var app = require("express")();

var Users_coll = require("../Controllers/UsersController");

app
    .route("/")
    .put(Users_coll.update_a_user)
    .get(Users_coll.read_a_user)

module.exports = app;
