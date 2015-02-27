var path = require('path');
var archive = require('../helpers/archive-helpers');
var httpHelper = require('./http-helpers');
// require more modules/folders here!

var actions = {
  "GET": function(req,res,indexString){
    httpHelper.indexResponse(req, res, indexString);
  },
  "POST": function(req,res){
    httpHelper.collectData(req, res, function(req, res, indexString){
    httpHelper.indexResponse(req, res, indexString);
    });
  },
  "OPTIONS": function(req, res){
    httpHelper.sendResponse(res, null);
  }
  //"DELETE",
  //"PUT":
};

//handles requests for specific methods
exports.handleRequest = function (req, res, urlPath) {
  var action = actions[req.method];
  if (action){
    urLPath = urlPath === '/'? 'index.html': urLPath;
    action(req, res, urLPath);
  }
  else{
    httpHelper.sendResponse(res, 'Not Found', 404);
  }
  //res.end(archive.paths.list);
};
