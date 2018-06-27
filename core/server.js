var express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  bearerToken = require("express-bearer-token"),
  User = require('./API/Models/UsersModel'),
  Files = require('./API/Models/FileModel'),
  Folders = require('./API/Models/FolderModel'),
  Folders = require('./API/Models/SElementsModel'),
  config = require('./API/config/database');

var API = require('./API/Routes/routes'); //importing route

// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongoDb}`);
// mongoose.connect('mongodb://mongodb:27017/SupFileDB'); 

app.use(bodyParser.urlencoded({ extended: true, limit: config.maxUploadSize }));
app.use(bodyParser.json({ extended: true, limit: config.maxUploadSize }));
app.use('/previews', express.static(`${config.storageDir}previews`));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD, OPTIONS");
  next();
});

app.use(bearerToken());

app.use("/API", API);
app.listen(config.port);

console.log('SupFile RESTful API server started on: ' + config.port);
