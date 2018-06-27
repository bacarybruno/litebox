'use strict';

var mongoose = require('mongoose'),
    fs = require('fs'),
    Folder_doc = mongoose.model('Folder_Doc'),
    File_doc = mongoose.model('File_Doc'),
    SElements_doc = mongoose.model('SElements_Doc');

const dir = require("../Config/database").storageDir;
const serverName = require("../Config/database").serverName;

const h = require("../Helpers/Common");
const sendError = h.sendError,
  sendSuccess = h.sendSuccess;

var Helper = {
  Download_a_folder: require("../Helpers/Download").Download_a_folder,
  Download_a_file: require("../Helpers/Download").Download_a_file,
  findPath: require("../Helpers/Download").findPath  
};  

  exports.list_all_elements = function(req, res) {
    SElements_doc.find({Owner:req.params.Owner},  function(err, element) {
      if (err)
        return res.send(err);
      res.json(element);
    });
  };
  
  exports.add_an_element = function(req, res) {
    var new_element = new SElements_doc(req.body);

    new_element.owner = req.user.userId; 

    new_element.save(function(err, element) {
        if (err)
            return sendError(err, res);
        return res.json({success: true, data:{ path: serverName + "/API/share/" + element._id}});    
    });
  };
  
  exports.find_an_element = function(req, res) {
    SElements_doc.findOne({_id:req.params.elementId}, function(err, element) {
      if (err || !element)
        return sendError((err) ? err : "element not found", res);

        if(element.type == "folder"){
          Folder_doc.findOne({_id:element.elementId}, function(err, folder) {
            if (err)
              return res.sendError(err, res);

            Helper.findPath(folder.parentId, folder.name, (err, path) => {
              if(err) return sendError(err, res);
              console.log("path " + path);
              Helper.Download_a_folder(path, 
                folder.name + ".zip", 
                (result) => {
                  return res.download(result, (err) => {
                    fs.unlink(result, () => {});
                  });
                });

            });
          });

        }else if(element.type == "file"){          
          File_doc.findOne({_id:element.elementId}, function(err, file) {
            if (err) return sendError(err, res);
            
            Helper.findPath(file.parentId, file.name, (err, path) => {
              return res.download(dir + path);
            });
          });
        }
    });

  };
  
  exports.update_an_element = function(req, res) {
    SElements_doc.findOneAndUpdate({_id: req.params.elementId}, req.body, {new: true}, function(err, element) {
      if (err)
        return res.send(err);
      res.json(element);
    });
  };
  
  exports.delete_an_element = function(req, res) {
    SElements_doc.remove({_id: req.params.elementId}, function(err, element) {
      if (err || element.n <= 0)
        return sendError( (err) ? err : "element not found", res);
      res.json({success:true, data: {message: 'element successfully deleted' }});
    });
  };

    