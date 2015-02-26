var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
// require more modules/folders here!

var actions = {
  "GET": function(req,res,indexString){
    console.log("test get");
    httpHelper.indexResponse(req, res, indexString);
  },
  "POST": function(req,res){
    httpHelper.collectData(req, res, function(req, res, indexString){
    httpHelper.indexResponse(req, res, indexString);
    });
  },
  "OPTIONS": function(req, res){
    console.log("test options");
    httpHelper.sendResponse(res, null);
  }
  //"DELETE",
  //"PUT":
};


exports.handleRequest = function (req, res) {
  var action = actions[req.method];
  if (action){
    console.log("test exports");
    action(req, res, '/index.html');
  }
  else{
    httpHelper.sendResponse(res, 'Not Found', 404);
  }
  //res.end(archive.paths.list);
};
