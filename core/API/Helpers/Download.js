var fs = require('fs'),
  mkdirp = require('mkdirp'),
  rimraf = require('rimraf'),
  mongoose = require('mongoose'),
  archiver = require('archiver');

var Folder_doc = mongoose.model('Folder_Doc');

const dir = require("../Config/database").storageDir;

exports.Upload_a_file = function(req, res) {
  upload(req.body.content, req.body.name);
};

exports.rename_a_file = function(oldPath, newPath, CallBack) {
  fs.rename(dir + oldPath, dir + newPath, CallBack);
};

exports.make_a_dir = function( path, CallBack) {
  mkdirp(dir + path, CallBack);
};

exports.delete_a_dir = function( path, CallBack) {
  rimraf(dir + path, CallBack);
};

exports.delete_a_file = function( path, CallBack) {
  fs.unlink(dir + path, CallBack);
};

exports.upload = function(content, path, CallBack) {
  var string = content; //"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
  var data = string.split(',')[1];
  var buffer = new Buffer(data, 'base64');
  fs.writeFile(dir + path, buffer, CallBack);
};

exports.Download_a_folder = function(srcFolder, zipFileName, CallBack) {
  console.log(dir + srcFolder, zipFileName);
  srcFolder = dir + srcFolder;
  var output = fs.createWriteStream(dir + "temp/" + zipFileName);
  var zipArchiver = archiver('zip');

  output.on('close', function() {
    CallBack(dir + "temp/" + zipFileName);
  });

  zipArchiver.pipe(output);
  
  zipArchiver.glob('**/*', { 
    cwd: srcFolder,
    expand: true 
  }, {});

  zipArchiver.finalize();
};

exports.findPath = function(parentId, filePath, CallBack){
  var result = filePath;
  console.log(filePath);
  Folder_doc.findOne({_id: parentId}, (err, folder) => {
    if(err || !folder) return CallBack( (err) ? err : "Folder not found", null);
    
    if(!folder.parentId) return CallBack(null, result = folder.owner + "/default/" + result);

    result = folder.name + "/" + result;
    exports.findPath(folder.parentId, result, CallBack);
  });
}