var app = require("express")();
var jwt = require("express-jwt");
var secret = require("../config/database").secret;

var SElements_Coll = require("../Controllers/SElementsController");

app
    .route("/")
    .post(jwt({secret}), SElements_Coll.add_an_element)
app
    .route("/:elementId")
    .get(SElements_Coll.find_an_element)
    .delete(SElements_Coll.delete_an_element)

module.exports = app;
