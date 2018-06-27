var app = require("express")();

var Users_coll = require("../Controllers/UsersController");

app
    .route("/login")
    .post(Users_coll.login_a_user);

app
    .route("/register")
    .post(Users_coll.create_a_user);

module.exports = app;